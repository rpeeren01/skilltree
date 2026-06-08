import { useGameStore } from '../lib/gameStore'
import { QuestCard } from './common/QuestCard'

export function Quests() {
  const { dailyQuests, weeklyQuests, gold, streakDays } = useGameStore()

  const completedDaily = dailyQuests.filter(q => q.status === 'completed').length
  const completedWeekly = weeklyQuests.filter(q => q.status === 'completed').length
  const streakBonus = streakDays >= 7

  return (
    <div className="page-enter pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5 px-4 py-4">
        <h1 className="text-xl font-bold text-white">Quests</h1>
        <div className="text-xs text-[#666] mt-0.5">Complete quests to earn Gold</div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* Streak Bonus Banner */}
        {streakBonus && (
          <div className="mt-4 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-[#FFD700] font-bold text-sm">{streakDays}-Day Streak Bonus Active!</div>
              <div className="text-xs text-[#888]">+25% Gold on next quest claim</div>
            </div>
          </div>
        )}

        {/* Gold Converter */}
        <div className="mt-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#888]">Your Gold</div>
              <div className="text-2xl font-bold text-[#FFD700]">{gold.toLocaleString()}</div>
              <div className="text-xs text-[#555] mt-0.5">≈ ${(gold / 100).toFixed(2)} real value</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#666] mb-1">1,000G = $10</div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Daily Quests */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider">Daily Quests</h2>
            <div className="text-xs text-[#555]">{completedDaily}/{dailyQuests.length} done</div>
          </div>

          {/* Daily progress */}
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
            <div
              className="h-1.5 rounded-full bg-[#FFD700] transition-all duration-500"
              style={{ width: `${(completedDaily / dailyQuests.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-3">
            {dailyQuests.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>

        {/* Weekly Quests */}
        <section className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider">Weekly Quests</h2>
            <div className="text-xs text-[#555]">{completedWeekly}/{weeklyQuests.length} done</div>
          </div>

          {/* Weekly progress */}
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
            <div
              className="h-1.5 rounded-full bg-[#00D9FF] transition-all duration-500"
              style={{ width: `${(completedWeekly / weeklyQuests.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-3">
            {weeklyQuests.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>

        {/* Motivational footer */}
        <div className="mt-2 mb-8 text-center py-6">
          <div className="text-4xl mb-2">⚔️</div>
          <div className="text-[#555] text-sm">Every skill logged is a quest progressed.</div>
          <div className="text-[#444] text-xs mt-1">Go grind some XP, {useGameStore.getState().username}.</div>
        </div>
      </div>
    </div>
  )
}
