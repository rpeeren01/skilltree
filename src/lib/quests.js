export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(new Date().setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export function updateQuestProgress(quests, skillId, unitCount, xpGained, leveledUp) {
  return quests.map(q => {
    if (q.claimed) return q;
    let delta = 0;
    switch (q.unit) {
      case 'xp':      delta = xpGained; break;
      case 'levelup': delta = leveledUp ? 1 : 0; break;
      default:
        if (q.unit === skillId) delta = unitCount;
        break;
    }
    if (delta <= 0) return q;
    return { ...q, progress: Math.min(q.progress + delta, q.goal) };
  });
}

export function updateMilestoneProgress(milestones, { totalXP, maxSkillLevel, streakDays }) {
  return milestones.map(m => {
    if (m.claimed) return m;
    let progress = m.progress;
    if (m.unit === 'totalxp')  progress = totalXP;
    if (m.unit === 'maxlevel') progress = maxSkillLevel;
    if (m.unit === 'streak')   progress = streakDays;
    return { ...m, progress };
  });
}

export function shouldResetDaily(lastReset) {
  return lastReset !== getToday();
}

export function shouldResetWeekly(lastReset) {
  return lastReset !== getWeekStart();
}
