import { useGameStore, levelFromXP, xpInCurrentLevel, xpToNextLevel } from '../../lib/gameStore'
import { ProgressBar } from './ProgressBar'

export function SkillCard({ skill, onClick }) {
  const level = levelFromXP(skill.totalXP)
  const xpIn = xpInCurrentLevel(skill.totalXP)
  const xpNext = xpToNextLevel(level)
  const pct = Math.round((xpIn / xpNext) * 100)

  // Tier label
  const getTier = (lvl) => {
    if (lvl < 5) return { label: 'Novice', color: '#888' }
    if (lvl < 10) return { label: 'Apprentice', color: '#00FF88' }
    if (lvl < 20) return { label: 'Journeyman', color: '#00D9FF' }
    if (lvl < 30) return { label: 'Expert', color: '#FFD700' }
    if (lvl < 50) return { label: 'Master', color: '#FF6B35' }
    return { label: 'Grandmaster', color: '#FF006E' }
  }

  const tier = getTier(level)

  return (
    <div
      onClick={onClick}
      className="skill-card cursor-pointer bg-[#1a1a1a] border border-white/10 rounded-xl p-4 select-none"
    >
      {/* Icon + Level */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{skill.icon}</div>
        <div className="text-right">
          <div className="text-[#FFD700] font-bold text-xl leading-none">{level}</div>
          <div className="text-[10px] mt-0.5" style={{ color: tier.color }}>{tier.label}</div>
        </div>
      </div>

      {/* Name */}
      <div className="text-sm font-semibold text-white mb-2 leading-tight">{skill.name}</div>

      {/* XP Bar */}
      <ProgressBar current={xpIn} max={xpNext} />
      <div className="text-[10px] text-[#666] mt-1">{xpIn}/{xpNext} XP</div>
    </div>
  )
}
