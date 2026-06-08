import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SKILLS, INITIAL_DAILY_QUESTS, INITIAL_WEEKLY_QUESTS, INITIAL_MILESTONES, COSMETICS } from '../lib/seed.js';
import { applyXp } from '../lib/leveling.js';
import { updateQuestProgress, updateMilestoneProgress, shouldResetDaily, shouldResetWeekly, getToday, getWeekStart } from '../lib/quests.js';

const INITIAL_STATE = {
  username: '',
  avatar: 'avatar-default',
  onboarded: false,
  gold: 0,
  skills: SKILLS,
  dailyQuests: INITIAL_DAILY_QUESTS,
  weeklyQuests: INITIAL_WEEKLY_QUESTS,
  milestones: INITIAL_MILESTONES,
  lastDailyReset: '',
  lastWeeklyReset: '',
  streakDays: 0,
  lastCheckIn: '',
  totalXP: 0,
  xpHistory: [],
  goldHistory: [],
  cosmetics: COSMETICS,
  skillPoints: 0,
  perks: { xpMultiplierLevel: 0, critChanceLevel: 0, dailyGoldLevel: 0 },
  redemptions: [],
  soundEnabled: true,
  activeTab: 'home',
  pendingLevelUps: [],
  toasts: [],
};

function getDerivedPerks(perks) {
  return {
    xpMultiplier: 1 + (perks.xpMultiplierLevel || 0) * 0.05,
    critChance: 0.12 + (perks.critChanceLevel || 0) * 0.02,
    dailyGoldBonus: (perks.dailyGoldLevel || 0) * 5,
  };
}

function computeStreakUpdate(lastCheckIn, streakDays) {
  const today = getToday();
  if (lastCheckIn === today) return { newStreak: streakDays, wasReset: false, isNew: false };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  if (!lastCheckIn) return { newStreak: 1, wasReset: false, isNew: true };
  if (lastCheckIn === yStr) return { newStreak: streakDays + 1, wasReset: false, isNew: true };
  return { newStreak: 1, wasReset: true, isNew: true };
}

const useStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setActiveTab: (tab) => set({ activeTab: tab }),

      completeOnboarding: (username, avatar) => {
        set({ username, avatar, onboarded: true, streakDays: 1, lastCheckIn: getToday() });
      },

      addXp: (skillId, unitCount) => {
        const state = get();
        const skillIdx = state.skills.findIndex(s => s.id === skillId);
        if (skillIdx === -1) return null;

        const skill = state.skills[skillIdx];
        const rawAmount = Math.round(unitCount * (skill.xpPerUnit || 1));
        const derived = getDerivedPerks(state.perks);
        const streakInfo = computeStreakUpdate(state.lastCheckIn, state.streakDays);
        const newStreakDays = streakInfo.newStreak;
        const streakBonus = newStreakDays >= 7 ? 1.2 : 1.0;

        const { newSkill, events, goldEarned, xpApplied, isCrit } = applyXp(skill, rawAmount, {
          xpMultiplier: derived.xpMultiplier * streakBonus,
          critChance: derived.critChance,
        });

        const levelUps = events.filter(e => e.type === 'levelup');
        const leveledUp = levelUps.length > 0;
        const skills = state.skills.map((s, i) => i === skillIdx ? newSkill : s);
        const maxSkillLevel = Math.max(...skills.map(s => s.level));
        const newTotalXP = state.totalXP + xpApplied;
        const today = getToday();

        let dailyQuests = updateQuestProgress(state.dailyQuests, skillId, unitCount, xpApplied, leveledUp);
        let weeklyQuests = updateQuestProgress(state.weeklyQuests, skillId, unitCount, xpApplied, leveledUp);
        let milestones = updateMilestoneProgress(state.milestones, { totalXP: newTotalXP, maxSkillLevel, streakDays: newStreakDays });

        const newGold = state.gold + goldEarned;
        const newSkillPoints = state.skillPoints + levelUps.length;

        const xpHistEntry = state.xpHistory.find(h => h.date === today);
        const xpHistory = xpHistEntry
          ? state.xpHistory.map(h => h.date === today ? { ...h, xp: h.xp + xpApplied } : h)
          : [...state.xpHistory, { date: today, xp: xpApplied }];

        const goldHistEntry = state.goldHistory.find(h => h.date === today);
        const goldHistory = goldEarned > 0
          ? (goldHistEntry
              ? state.goldHistory.map(h => h.date === today ? { ...h, gold: h.gold + goldEarned } : h)
              : [...state.goldHistory, { date: today, gold: goldEarned }])
          : state.goldHistory;

        const newToasts = [];
        newToasts.push({ id: Date.now(), text: `+${xpApplied} XP${isCrit ? ' — CRIT!' : ''}`, type: isCrit ? 'crit' : 'xp' });
        if (goldEarned > 0) newToasts.push({ id: Date.now() + 1, text: `+${goldEarned} Gold`, type: 'gold' });
        if (streakInfo.wasReset) newToasts.push({ id: Date.now() + 2, text: 'Streak lost! Back to 1 day.', type: 'danger' });

        const pendingLevelUps = levelUps.length > 0
          ? [...state.pendingLevelUps, ...levelUps.map(e => ({ ...e, skillName: skill.name, skillId }))]
          : state.pendingLevelUps;

        set({
          skills,
          gold: newGold,
          totalXP: newTotalXP,
          dailyQuests,
          weeklyQuests,
          milestones,
          streakDays: newStreakDays,
          lastCheckIn: today,
          skillPoints: newSkillPoints,
          xpHistory,
          goldHistory,
          pendingLevelUps,
          toasts: [...state.toasts, ...newToasts],
        });

        return { xpApplied, goldEarned, isCrit, levelUps, streakInfo };
      },

      dismissLevelUp: () => {
        set(state => ({ pendingLevelUps: state.pendingLevelUps.slice(1) }));
      },

      dismissToast: (id) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
      },

      addToast: (text, type = 'info') => {
        const id = Date.now() + Math.random();
        set(state => ({ toasts: [...state.toasts, { id, text, type }] }));
        setTimeout(() => get().dismissToast(id), 3000);
      },

      claimQuest: (questId) => {
        const state = get();
        const all = [...state.dailyQuests, ...state.weeklyQuests, ...state.milestones];
        const quest = all.find(q => q.id === questId);
        if (!quest || quest.claimed || quest.progress < quest.goal) return;

        const gold = quest.reward.gold || 0;
        const today = getToday();
        const goldHistEntry = state.goldHistory.find(h => h.date === today);
        const goldHistory = goldHistEntry
          ? state.goldHistory.map(h => h.date === today ? { ...h, gold: h.gold + gold } : h)
          : [...state.goldHistory, { date: today, gold }];

        const claim = arr => arr.map(q => q.id === questId ? { ...q, claimed: true } : q);

        set({
          gold: state.gold + gold,
          goldHistory,
          dailyQuests: claim(state.dailyQuests),
          weeklyQuests: claim(state.weeklyQuests),
          milestones: claim(state.milestones),
          toasts: [...state.toasts, { id: Date.now(), text: `Quest complete! +${gold}g`, type: 'gold' }],
        });
      },

      buyItem: (itemId) => {
        const state = get();
        const item = state.cosmetics.find(c => c.id === itemId);
        if (!item || item.owned || state.gold < item.cost) return false;
        set({
          gold: state.gold - item.cost,
          cosmetics: state.cosmetics.map(c => c.id === itemId ? { ...c, owned: true } : c),
        });
        return true;
      },

      equipItem: (itemId) => {
        const state = get();
        const item = state.cosmetics.find(c => c.id === itemId);
        if (!item || !item.owned) return;
        set({
          cosmetics: state.cosmetics.map(c =>
            c.type === item.type ? { ...c, equipped: c.id === itemId } : c
          ),
        });
      },

      redeemReward: (reward) => {
        const state = get();
        if (state.gold < reward.goldCost) return false;
        const redemption = {
          id: Date.now(),
          rewardId: reward.id,
          name: reward.name,
          goldSpent: reward.goldCost,
          timestamp: new Date().toISOString(),
        };
        set({
          gold: state.gold - reward.goldCost,
          redemptions: [...state.redemptions, redemption],
          toasts: [...state.toasts, { id: Date.now(), text: `Redeemed: ${reward.name}!`, type: 'gold' }],
        });
        return true;
      },

      spendSkillPoint: (perkKey) => {
        const state = get();
        if (state.skillPoints < 1) return false;
        set({
          skillPoints: state.skillPoints - 1,
          perks: { ...state.perks, [perkKey]: (state.perks[perkKey] || 0) + 1 },
        });
        return true;
      },

      updateSkillXpPerUnit: (skillId, val) => {
        set(state => ({
          skills: state.skills.map(s => s.id === skillId ? { ...s, xpPerUnit: val } : s),
        }));
      },

      checkDailyReset: () => {
        const state = get();
        const updates = {};
        if (shouldResetDaily(state.lastDailyReset)) {
          updates.dailyQuests = INITIAL_DAILY_QUESTS.map(q => ({ ...q, progress: 0, claimed: false }));
          updates.lastDailyReset = getToday();
        }
        if (shouldResetWeekly(state.lastWeeklyReset)) {
          updates.weeklyQuests = INITIAL_WEEKLY_QUESTS.map(q => ({ ...q, progress: 0, claimed: false }));
          updates.lastWeeklyReset = getWeekStart();
        }
        if (Object.keys(updates).length > 0) set(updates);
      },

      toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
    }),
    { name: 'ascend-store-v1' }
  )
);

export default useStore;
