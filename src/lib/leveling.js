export function xpForLevel(L) {
  return Math.round(100 * Math.pow(1.5, L - 1));
}

export function totalXpForLevel(L) {
  let total = 0;
  for (let i = 1; i < L; i++) total += xpForLevel(i);
  return total;
}

// Returns { newSkill, events, goldEarned, xpApplied, isCrit }
export function applyXp(skill, rawAmount, { xpMultiplier = 1, critChance = 0.12 } = {}) {
  const events = [];

  const isCrit = Math.random() < critChance;
  let amount = rawAmount;
  let critBonusGold = 0;

  if (isCrit) {
    amount = Math.round(rawAmount * 2);
    critBonusGold = 15;
    events.push({ type: 'crit', bonusGold: critBonusGold });
  }

  amount = Math.round(amount * xpMultiplier);

  let currentXP = (skill.currentXP || 0) + amount;
  let level = skill.level || 1;
  let goldEarned = critBonusGold;
  const history = [...(skill.history || [])];

  while (currentXP >= xpForLevel(level)) {
    currentXP -= xpForLevel(level);
    level++;
    const levelGold = 10 * level;
    goldEarned += levelGold;

    const ev = { type: 'levelup', level, gold: levelGold };

    if (Math.random() < 0.1) {
      const tGold = 50 + Math.floor(Math.random() * 101);
      const tXp = Math.round(xpForLevel(level) * 0.3);
      ev.treasure = true;
      ev.treasureGold = tGold;
      ev.treasureXp = tXp;
      goldEarned += tGold;
      currentXP += tXp;
    }

    history.push({ level, gainedAt: new Date().toISOString(), goldReward: levelGold });
    events.push(ev);
  }

  return {
    newSkill: { ...skill, level, currentXP, history },
    events,
    goldEarned,
    xpApplied: amount,
    isCrit,
  };
}
