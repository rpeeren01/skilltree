import { ProgressBar } from './ProgressBar'

export function QuestCard({ quest }) {
  const pct = quest.target > 0 ? Math.min(100, (quest.current / quest.target) * 100) : 0
  const isComplete = quest.status === 'completed'
  const dollarValue = (quest.reward.gold / 100).toFixed(2)

  // Time remaining
  const timeLeft = () => {
    const diff = new Date(quest.expiresAt) - new Date()
    if (diff <= 0) return 'Expired'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (h > 24) return `${Math.floor(h / 24)}d left`
    if (h > 0) return `${h}h ${m}m left`
    return `${m}m left`
  }

  return (
    <div className={`bg-[#1a1a1a] border rounded-xl p-4 transition-all ${
      isComplete
        ? 'border-[#00FF88]/50 opacity-75'
        : 'border-white/10'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{quest.icon}</span>
          <div>
            <div className={`font-semibold text-sm ${isComplete ? 'line-through text-[#666]' : 'text-white'}`}>
              {quest.title}
            </div>
            <div className="text-xs text-[#666]">{quest.description}</div>
          </div>
        </div>
        <div className="text-right ml-2 shrink-0">
          <div className={`text-sm font-bold ${isComplete ? 'text-[#00FF88]' : 'text-[#FFD700]'}`}>
            {isComplete ? '✅' : `+${quest.reward.gold}G`}
          </div>
          <div className="text-[10px] text-[#555]">${dollarValue}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <ProgressBar
          current={quest.current}
          max={quest.target}
          color={isComplete ? '#00FF88' : undefined}
        />
        <span className="text-xs text-[#666] whitespace-nowrap shrink-0">
          {quest.current}/{quest.target}
        </span>
      </div>

      <div className="text-[10px] text-[#444] mt-1.5 flex justify-between">
        <span>{quest.type === 'weekly' ? '📅 Weekly' : '☀️ Daily'}</span>
        <span>{timeLeft()}</span>
      </div>
    </div>
  )
}
