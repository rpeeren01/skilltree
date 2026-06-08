import { useState } from 'react'
import { useGameStore, levelFromXP } from '../lib/gameStore'
import { playXPSound, playLevelUpSound, playGoldSound } from '../lib/gameStore'

export function Settings() {
  const {
    username, gold, totalXPEarned, streakDays, skills,
    soundEnabled, notificationsEnabled, spendingBalance,
    setSoundEnabled, setNotificationsEnabled, setUsername,
  } = useGameStore()

  const [editName, setEditName] = useState(false)
  const [tempName, setTempName] = useState(username)

  const totalLevel = skills.reduce((sum, s) => sum + levelFromXP(s.totalXP), 0)
  const highestSkill = skills.reduce((best, s) => {
    const l = levelFromXP(s.totalXP)
    return l > levelFromXP(best.totalXP) ? s : best
  }, skills[0])
  const highestLevel = levelFromXP(highestSkill?.totalXP || 0)

  const handleSaveName = () => {
    if (tempName.trim()) setUsername(tempName.trim())
    setEditName(false)
  }

  const handleResetData = () => {
    if (confirm('⚠️ Reset ALL data? This cannot be undone!')) {
      localStorage.removeItem('skilltree-game')
      window.location.reload()
    }
  }

  return (
    <div className="page-enter pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5 px-4 py-4">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <div className="text-xs text-[#666]">Customize your experience</div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Profile Card */}
        <div className="mt-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold text-2xl shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editName ? (
                <div className="flex gap-2">
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    className="flex-1 bg-[#111] border border-[#FFD700]/50 rounded-lg px-3 py-1.5 text-white text-sm"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-[#00FF88] text-sm px-2">✓</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{username}</span>
                  <button onClick={() => setEditName(true)} className="text-[#555] hover:text-[#888] text-xs">✎</button>
                </div>
              )}
              <div className="text-xs text-[#555] mt-1">Entrepreneur · Level {totalLevel}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <div className="text-xs text-[#666] mb-1">Total XP Earned</div>
            <div className="text-xl font-bold text-white">{totalXPEarned.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <div className="text-xs text-[#666] mb-1">Gold Earned</div>
            <div className="text-xl font-bold text-[#FFD700]">{gold.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <div className="text-xs text-[#666] mb-1">Best Streak</div>
            <div className="text-xl font-bold text-orange-400">{streakDays} 🔥</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <div className="text-xs text-[#666] mb-1">Spending Balance</div>
            <div className="text-xl font-bold text-[#00FF88]">${spendingBalance.toFixed(2)}</div>
          </div>
        </div>

        {/* Best Skill */}
        {highestLevel > 1 && (
          <div className="mt-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center gap-4">
            <div className="text-4xl">{highestSkill.icon}</div>
            <div>
              <div className="text-xs text-[#666]">Strongest Skill</div>
              <div className="font-bold text-white">{highestSkill.name}</div>
              <div className="text-sm text-[#FFD700]">Level {highestLevel}</div>
            </div>
          </div>
        )}

        {/* Sound Settings */}
        <div className="mt-6 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
          <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">Sound</h3>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <div className="text-sm text-white">Sound Effects</div>
              <div className="text-xs text-[#555]">XP gains, level-ups, gold</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${soundEnabled ? 'bg-[#FFD700]' : 'bg-[#333]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${soundEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {soundEnabled && (
            <div className="pt-3 flex flex-col gap-2">
              <div className="text-xs text-[#666] mb-1">Test sounds:</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={playXPSound} className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-lg text-xs text-[#888] hover:text-white">XP Gain</button>
                <button onClick={playLevelUpSound} className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-lg text-xs text-[#888] hover:text-white">Level Up</button>
                <button onClick={playGoldSound} className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-lg text-xs text-[#888] hover:text-white">Gold</button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Overview */}
        <div className="mt-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
          <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">Skill Levels</h3>
          <div className="grid grid-cols-2 gap-2">
            {skills.map(s => {
              const lvl = levelFromXP(s.totalXP)
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs text-[#888] flex-1 truncate">{s.name}</span>
                  <span className="text-xs font-bold text-[#FFD700]">Lv.{lvl}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 p-4 bg-[#1a1a1a] border border-red-500/20 rounded-xl mb-8">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">⚠️ Danger Zone</h3>
          <button
            onClick={handleResetData}
            className="w-full py-3 border border-red-500/30 rounded-xl text-red-400 text-sm hover:bg-red-500/10 transition-all"
          >
            Reset All Data
          </button>
          <div className="text-xs text-[#444] text-center mt-2">This will delete ALL progress permanently</div>
        </div>
      </div>
    </div>
  )
}
