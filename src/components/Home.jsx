import { useEffect, useRef, useState } from 'react'
import { useGameStore, levelFromXP } from '../lib/gameStore'
import { fireConfetti } from '../lib/confetti'
import { SkillCard } from './common/SkillCard'
import { QuestCard } from './common/QuestCard'
import { ProgressBar } from './common/ProgressBar'

export function Home() {
  const {
    username, gold, streakDays, skills, dailyQuests, weeklyQuests,
    setSelectedSkill, logXP, totalXPEarned, lastCheckIn, checkQuestReset,
  } = useGameStore()

  const [levelUpSkill, setLevelUpSkill] = useState(null)
  const levelUpTimer = useRef(null)

  useEffect(() => {
    checkQuestReset()
  }, [])

  // Check streak status
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const isStreakActive = lastCheckIn === today || lastCheckIn === yesterday
  const streakWarning = streakDays >= 5 && lastCheckIn !== today

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill.id)
  }

  // Active quests - show top 3 active
  const activeQuests = [...dailyQuests, ...weeklyQuests].filter(q => q.status === 'active').slice(0, 3)

  // Total level
  const totalLevel = skills.reduce((sum, s) => sum + levelFromXP(s.totalXP), 0)

  return (
    <div className="page-enter pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Streak */}
          <div className={`flex items-center gap-2 ${streakWarning ? 'animate-streak-pulse' : ''}`}>
            <span className="text-2xl">🔥</span>
            <div>
              <div className={`font-bold text-lg leading-none ${streakWarning ? 'text-red-400' : 'text-orange-400'}`}>
                {streakDays}
              </div>
              <div className="text-[10px] text-[#555]">
                {streakWarning ? '⚠️ streak at risk!' : 'day streak'}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <div className="text-sm text-[#888]">Welcome back,</div>
            <div className="text-base font-bold text-white">{username}</div>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[#FFD700] font-bold text-lg leading-none">{gold.toLocaleString()}</div>
              <div className="text-[10px] text-[#555]">gold</div>
            </div>
            <span className="text-2xl">🪙</span>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto lg:max-w-4xl">
        {/* Total XP Banner */}
        <div className="mt-4 p-4 bg-gradient-to-r from-[#FFD700]/10 to-[#00D9FF]/10 border border-white/10 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#888] mb-1">Total XP Earned</div>
              <div className="text-2xl font-bold text-white">{totalXPEarned.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#888] mb-1">Combined Level</div>
              <div className="text-2xl font-bold text-[#FFD700]">{totalLevel}</div>
            </div>
            <div className="text-5xl opacity-30">⚔️</div>
          </div>
        </div>

        {/* Active Quests */}
        {activeQuests.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider">Active Quests</h2>
              <button
                onClick={() => useGameStore.getState().setScreen('quests')}
                className="text-xs text-[#FFD700] hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {activeQuests.map(q => <QuestCard key={q.id} quest={q} />)}
            </div>
          </section>
        )}

        {/* Skills Grid */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider">Skills</h2>
            <div className="text-xs text-[#555]">Tap to log XP</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => handleSkillClick(skill)}
              />
            ))}
          </div>
        </section>

        {/* Streak warning banner */}
        {streakWarning && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse-red">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="text-red-400 font-bold">Streak at Risk!</div>
                <div className="text-sm text-[#888]">Log some XP today to keep your {streakDays}-day streak alive!</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
