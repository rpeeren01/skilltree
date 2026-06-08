import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// XP required to reach level N from level 1
export function xpForLevel(level) {
  if (level <= 1) return 0
  let total = 0
  let req = 100
  for (let i = 1; i < level; i++) {
    total += Math.round(req)
    req *= 1.5
  }
  return Math.round(total)
}

// XP needed to go from level N to N+1
export function xpToNextLevel(level) {
  return Math.round(100 * Math.pow(1.5, level - 1))
}

// Current level from total XP
export function levelFromXP(totalXP) {
  let level = 1
  let req = 100
  let accumulated = 0
  while (accumulated + Math.round(req) <= totalXP) {
    accumulated += Math.round(req)
    req *= 1.5
    level++
  }
  return level
}

// XP within current level
export function xpInCurrentLevel(totalXP) {
  const level = levelFromXP(totalXP)
  const xpAtStart = xpForLevel(level)
  return totalXP - xpAtStart
}

const DEFAULT_SKILLS = [
  { id: 'deep-work', name: 'Deep Work', icon: '⚡', unit: 'hour', xpPerUnit: 50, totalXP: 0, history: [], color: '#00D9FF' },
  { id: 'reading', name: 'Reading', icon: '📖', unit: 'page', xpPerUnit: 5, totalXP: 0, history: [], color: '#FFD700' },
  { id: 'datacenter', name: 'Datacenter', icon: '🖥️', unit: 'module', xpPerUnit: 75, totalXP: 0, history: [], color: '#00FF88' },
  { id: 'sales', name: 'Sales & Outreach', icon: '📞', unit: 'call', xpPerUnit: 30, totalXP: 0, history: [], color: '#FF6B35' },
  { id: 'code', name: 'Code & Building', icon: '💻', unit: 'commit', xpPerUnit: 40, totalXP: 0, history: [], color: '#9D4EDD' },
  { id: 'marketing', name: 'Marketing', icon: '📣', unit: 'piece', xpPerUnit: 35, totalXP: 0, history: [], color: '#F72585' },
  { id: 'finance', name: 'Financial Analysis', icon: '💰', unit: 'deal', xpPerUnit: 60, totalXP: 0, history: [], color: '#4CC9F0' },
  { id: 'fitness', name: 'Fitness', icon: '💪', unit: 'workout', xpPerUnit: 80, totalXP: 0, history: [], color: '#FB5607' },
  { id: 'sleep', name: 'Sleep Quality', icon: '😴', unit: 'night', xpPerUnit: 40, totalXP: 0, history: [], color: '#7B2FBE' },
  { id: 'phone-control', name: 'Phone Control', icon: '📵', unit: 'hour', xpPerUnit: 25, totalXP: 0, history: [], color: '#06D6A0' },
  { id: 'procflow', name: 'ProcFlow Dev', icon: '🚀', unit: 'sprint', xpPerUnit: 120, totalXP: 0, history: [], color: '#3A86FF' },
  { id: 'vault', name: 'Vault Content', icon: '🎬', unit: 'video', xpPerUnit: 100, totalXP: 0, history: [], color: '#FF006E' },
]

const generateDailyQuests = () => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setHours(23, 59, 59, 999)
  const expiresAt = tomorrow.toISOString()

  return [
    {
      id: 'daily-500xp',
      type: 'daily',
      title: 'Gain 500 XP',
      description: 'Earn XP across any skill',
      icon: '⭐',
      target: 500,
      current: 0,
      reward: { gold: 100 },
      status: 'active',
      expiresAt,
      trackType: 'totalXP',
    },
    {
      id: 'daily-read20',
      type: 'daily',
      title: 'Read 20 pages',
      description: 'Log reading sessions',
      icon: '📖',
      target: 20,
      current: 0,
      reward: { gold: 50 },
      status: 'active',
      expiresAt,
      trackType: 'skillUnits',
      skillId: 'reading',
    },
    {
      id: 'daily-phone1h',
      type: 'daily',
      title: '1 Hour Phone-Free',
      description: 'Log phone control time',
      icon: '📵',
      target: 1,
      current: 0,
      reward: { gold: 75 },
      status: 'active',
      expiresAt,
      trackType: 'skillUnits',
      skillId: 'phone-control',
    },
    {
      id: 'daily-levelup',
      type: 'daily',
      title: 'Level Up Any Skill',
      description: 'Reach a new level today',
      icon: '🏆',
      target: 1,
      current: 0,
      reward: { gold: 200 },
      status: 'active',
      expiresAt,
      trackType: 'levelUp',
    },
  ]
}

const generateWeeklyQuests = () => {
  const now = new Date()
  const sunday = new Date(now)
  sunday.setDate(sunday.getDate() + (7 - sunday.getDay()))
  sunday.setHours(23, 59, 59, 999)
  const expiresAt = sunday.toISOString()

  return [
    {
      id: 'weekly-100pages',
      type: 'weekly',
      title: 'Read 100 Pages',
      description: 'Log 100 pages of reading',
      icon: '📚',
      target: 100,
      current: 0,
      reward: { gold: 500 },
      status: 'active',
      expiresAt,
      trackType: 'skillUnits',
      skillId: 'reading',
    },
    {
      id: 'weekly-50h-deepwork',
      type: 'weekly',
      title: '50 Hours Deep Work',
      description: 'Log 50 hours of focus',
      icon: '⚡',
      target: 50,
      current: 0,
      reward: { gold: 750 },
      status: 'active',
      expiresAt,
      trackType: 'skillUnits',
      skillId: 'deep-work',
    },
    {
      id: 'weekly-tier-up',
      type: 'weekly',
      title: 'Reach Next Tier',
      description: 'Level any skill to 5, 10, 20...',
      icon: '💎',
      target: 1,
      current: 0,
      reward: { gold: 400 },
      status: 'active',
      expiresAt,
      trackType: 'tierUp',
    },
  ]
}

const STORE_ITEMS = [
  { id: 'skin-neon-deep', name: 'Neon Deep Work', category: 'skins', price: 100, icon: '🌟', description: 'Neon glow for Deep Work skill', owned: false },
  { id: 'skin-flame-fitness', name: 'Flame Fitness', category: 'skins', price: 100, icon: '🔥', description: 'Fire theme for Fitness skill', owned: false },
  { id: 'avatar-entrepreneur', name: 'Entrepreneur', category: 'avatars', price: 150, icon: '👔', description: 'Classic entrepreneur look', owned: true },
  { id: 'avatar-scholar', name: 'Scholar', category: 'avatars', price: 150, icon: '🎓', description: 'Academic vibes', owned: false },
  { id: 'avatar-hacker', name: 'Hacker', category: 'avatars', price: 150, icon: '🦾', description: 'Terminal aesthetic', owned: false },
  { id: 'title-deep-master', name: 'Deep Work Master', category: 'titles', price: 75, icon: '⚡', description: 'Show off your focus', owned: false },
  { id: 'title-bookworm', name: 'Bookworm', category: 'titles', price: 75, icon: '📚', description: 'For the readers', owned: false },
  { id: 'title-hustler', name: 'The Hustler', category: 'titles', price: 75, icon: '💰', description: 'Sales legend', owned: false },
  { id: 'skin-matrix-code', name: 'Matrix Code', category: 'skins', price: 150, icon: '💻', description: 'Matrix theme for Code skill', owned: false },
  { id: 'skin-vault-gold', name: 'Vault Gold', category: 'skins', price: 120, icon: '🎬', description: 'Golden theme for Vault', owned: false },
]

export const useGameStore = create(
  persist(
    (set, get) => ({
      // User
      username: 'Robin',
      avatar: 'entrepreneur',
      activeTitle: null,
      gold: 0,
      totalXPEarned: 0,
      streakDays: 0,
      lastCheckIn: null,
      createdAt: new Date().toISOString(),

      // Skills
      skills: DEFAULT_SKILLS,

      // Quests
      dailyQuests: generateDailyQuests(),
      weeklyQuests: generateWeeklyQuests(),
      lastQuestReset: new Date().toDateString(),

      // Store
      storeItems: STORE_ITEMS,
      spendingBalance: 0, // in dollars

      // Settings
      soundEnabled: true,
      notificationsEnabled: false,

      // UI State (not persisted)
      activeScreen: 'home',
      selectedSkillId: null,
      toasts: [],
      floatingXP: [],

      // Actions
      setScreen: (screen) => set({ activeScreen: screen }),
      setSelectedSkill: (id) => set({ selectedSkillId: id, activeScreen: 'skill-detail' }),

      addToast: (toast) => {
        const id = Date.now().toString()
        set(state => ({ toasts: [...state.toasts, { ...toast, id }] }))
        setTimeout(() => {
          set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
        }, toast.duration || 3000)
      },

      addFloatingXP: (skillId, amount) => {
        const id = Date.now().toString()
        set(state => ({ floatingXP: [...state.floatingXP, { id, skillId, amount }] }))
        setTimeout(() => {
          set(state => ({ floatingXP: state.floatingXP.filter(f => f.id !== id) }))
        }, 1400)
      },

      logXP: (skillId, units, amount) => {
        const state = get()
        const skills = [...state.skills]
        const idx = skills.findIndex(s => s.id === skillId)
        if (idx === -1) return

        const skill = { ...skills[idx] }
        const oldLevel = levelFromXP(skill.totalXP)
        skill.totalXP += amount
        const newLevel = levelFromXP(skill.totalXP)
        const leveledUp = newLevel > oldLevel

        if (leveledUp) {
          for (let l = oldLevel + 1; l <= newLevel; l++) {
            skill.history = [
              { level: l, gainedAt: new Date().toISOString(), gold: 10 },
              ...(skill.history || []),
            ].slice(0, 20)
          }
        }

        skills[idx] = skill

        // Gold for level up
        const goldEarned = leveledUp ? (newLevel - oldLevel) * 10 : 0

        // Update streak
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        let streakDays = state.streakDays
        let lastCheckIn = state.lastCheckIn

        if (lastCheckIn !== today) {
          if (lastCheckIn === yesterday) {
            streakDays += 1
          } else if (!lastCheckIn) {
            streakDays = 1
          } else {
            // Streak broken
            streakDays = 1
          }
          lastCheckIn = today
        }

        const totalXPEarned = state.totalXPEarned + amount

        set({
          skills,
          gold: state.gold + goldEarned,
          totalXPEarned,
          streakDays,
          lastCheckIn,
        })

        // Update quests
        get().updateQuests(skillId, units, amount, leveledUp)

        // Floating XP
        get().addFloatingXP(skillId, amount)

        // Sounds
        if (state.soundEnabled) {
          leveledUp ? playLevelUpSound() : playXPSound()
        }

        if (leveledUp) {
          get().addToast({
            type: 'level-up',
            message: `${skill.icon} ${skill.name} reached Level ${newLevel}!`,
            duration: 4000,
          })
          // Return level up data for confetti
          return { leveledUp: true, newLevel, skill: skills[idx] }
        }

        return { leveledUp: false }
      },

      updateQuests: (skillId, units, xpAmount, leveledUp) => {
        const state = get()
        let dailyQuests = [...state.dailyQuests]
        let weeklyQuests = [...state.weeklyQuests]
        let goldEarned = 0
        let newToasts = []
        let streakBonus = state.streakDays >= 7 ? 1.25 : 1.0

        const updateQuest = (quest) => {
          if (quest.status !== 'active') return quest
          let current = quest.current

          if (quest.trackType === 'totalXP') {
            current = Math.min(quest.target, current + xpAmount)
          } else if (quest.trackType === 'skillUnits' && quest.skillId === skillId) {
            current = Math.min(quest.target, current + units)
          } else if (quest.trackType === 'levelUp' && leveledUp) {
            current = Math.min(quest.target, current + 1)
          } else if (quest.trackType === 'tierUp' && leveledUp) {
            const newLevel = levelFromXP(
              state.skills.find(s => s.id === skillId)?.totalXP || 0
            )
            if ([5, 10, 20, 30, 50].includes(newLevel)) {
              current = Math.min(quest.target, current + 1)
            }
          }

          if (current >= quest.target && quest.status === 'active') {
            const reward = Math.round(quest.reward.gold * streakBonus)
            goldEarned += reward
            newToasts.push({
              type: 'quest',
              message: `Quest Complete! ${quest.title} → +${reward} Gold 🏆`,
              duration: 4000,
            })
            return { ...quest, current, status: 'completed' }
          }

          return { ...quest, current }
        }

        dailyQuests = dailyQuests.map(updateQuest)
        weeklyQuests = weeklyQuests.map(updateQuest)

        if (goldEarned > 0) {
          if (state.soundEnabled) playGoldSound()
        }

        set({
          dailyQuests,
          weeklyQuests,
          gold: state.gold + goldEarned,
        })

        newToasts.forEach(t => get().addToast(t))
      },

      checkQuestReset: () => {
        const state = get()
        const today = new Date().toDateString()
        if (state.lastQuestReset !== today) {
          // Check if any daily quests are expired
          const now = new Date()
          const needsReset = state.dailyQuests.some(q => new Date(q.expiresAt) < now)
          if (needsReset) {
            set({
              dailyQuests: generateDailyQuests(),
              lastQuestReset: today,
            })
          }

          // Check weekly
          const needsWeeklyReset = state.weeklyQuests.some(q => new Date(q.expiresAt) < now)
          if (needsWeeklyReset) {
            set({ weeklyQuests: generateWeeklyQuests() })
          }
        }
      },

      buyItem: (itemId) => {
        const state = get()
        const items = [...state.storeItems]
        const idx = items.findIndex(i => i.id === itemId)
        if (idx === -1) return false

        const item = items[idx]
        if (item.owned) return false
        if (state.gold < item.price) return false

        items[idx] = { ...item, owned: true }

        set({
          storeItems: items,
          gold: state.gold - item.price,
        })

        if (item.category === 'avatars') set({ avatar: item.id.replace('avatar-', '') })
        if (item.category === 'titles') set({ activeTitle: item.name })

        get().addToast({
          type: 'purchase',
          message: `Purchased: ${item.icon} ${item.name}!`,
          duration: 3000,
        })

        return true
      },

      convertGold: (goldAmount) => {
        const state = get()
        if (state.gold < goldAmount) return false
        const dollars = goldAmount / 100 // 1000 gold = $10 → 100 gold = $1
        set({
          gold: state.gold - goldAmount,
          spendingBalance: state.spendingBalance + dollars,
        })
        get().addToast({
          type: 'convert',
          message: `Converted ${goldAmount} Gold → $${dollars.toFixed(2)} 💵`,
          duration: 4000,
        })
        return true
      },

      updateSkillSettings: (skillId, updates) => {
        const skills = get().skills.map(s =>
          s.id === skillId ? { ...s, ...updates } : s
        )
        set({ skills })
      },

      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setUsername: (v) => set({ username: v }),
    }),
    {
      name: 'skilltree-game',
      partialize: (state) => ({
        username: state.username,
        avatar: state.avatar,
        activeTitle: state.activeTitle,
        gold: state.gold,
        totalXPEarned: state.totalXPEarned,
        streakDays: state.streakDays,
        lastCheckIn: state.lastCheckIn,
        createdAt: state.createdAt,
        skills: state.skills,
        dailyQuests: state.dailyQuests,
        weeklyQuests: state.weeklyQuests,
        lastQuestReset: state.lastQuestReset,
        storeItems: state.storeItems,
        spendingBalance: state.spendingBalance,
        soundEnabled: state.soundEnabled,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
)

// Sound utilities
let audioCtx = null
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

export function playXPSound() {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  } catch (_) {}
}

export function playLevelUpSound() {
  try {
    const ctx = getAudioCtx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.18)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.18)
    })
  } catch (_) {}
}

export function playGoldSound() {
  try {
    const ctx = getAudioCtx()
    const notes = [1047, 1319]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07)
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.12)
      osc.start(ctx.currentTime + i * 0.07)
      osc.stop(ctx.currentTime + i * 0.07 + 0.12)
    })
  } catch (_) {}
}

export function playStreakBreakSound() {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch (_) {}
}
