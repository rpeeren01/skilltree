import { useState, useRef } from 'react'
import { useGameStore, levelFromXP, xpInCurrentLevel, xpToNextLevel, xpForLevel } from '../lib/gameStore'
import { fireConfetti } from '../lib/confetti'
import { ProgressBar } from './common/ProgressBar'

const UNIT_OPTIONS = [
  'hour', 'session', 'page', 'module', 'call', 'email', 'commit',
  'feature', 'piece', 'deal', 'workout', 'night', 'sprint', 'video', 'script', 'minute'
]

function getTier(lvl) {
  if (lvl < 5) return { label: 'Novice', color: '#888' }
  if (lvl < 10) return { label: 'Apprentice', color: '#00FF88' }
  if (lvl < 20) return { label: 'Journeyman', color: '#00D9FF' }
  if (lvl < 30) return { label: 'Expert', color: '#FFD700' }
  if (lvl < 50) return { label: 'Master', color: '#FF6B35' }
  return { label: 'Grandmaster', color: '#FF006E' }
}

export function SkillDetail() {
  const { skills, selectedSkillId, setScreen, logXP, updateSkillSettings } = useGameStore()
  const skill = skills.find(s => s.id === selectedSkillId)

  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState(skill?.unit || 'hour')
  const [showSettings, setShowSettings] = useState(false)
  const [customXPPerUnit, setCustomXPPerUnit] = useState(skill?.xpPerUnit || 1)
  const [customUnit, setCustomUnit] = useState(skill?.unit || 'hour')
  const [justLeveledUp, setJustLeveledUp] = useState(false)
  const [addedXPAnim, setAddedXPAnim] = useState(null)

  if (!skill) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button onClick={() => setScreen('home')} className="text-[#FFD700]">← Back</button>
      </div>
    )
  }

  const level = levelFromXP(skill.totalXP)
  const xpIn = xpInCurrentLevel(skill.totalXP)
  const xpNext = xpToNextLevel(level)
  const tier = getTier(level)
  const pct = (xpIn / xpNext) * 100

  const handleAddXP = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) return

    const xpGained = Math.round(n * skill.xpPerUnit)
    const result = logXP(skill.id, n, xpGained)

    setAddedXPAnim(`+${xpGained} XP`)
    setTimeout(() => setAddedXPAnim(null), 1200)

    if (result?.leveledUp) {
      setJustLeveledUp(true)
      fireConfetti()
      setTimeout(() => setJustLeveledUp(false), 2000)
    }

    setAmount('')
  }

  const handleSaveSettings = () => {
    updateSkillSettings(skill.id, {
      xpPerUnit: parseFloat(customXPPerUnit) || 1,
      unit: customUnit,
    })
    setShowSettings(false)
  }

  // History
  const recentHistory = skill.history?.slice(0, 5) || []

  return (
    <div className="page-enter pb-24 lg:pb-6 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="text-[#888] hover:text-white transition-colors p-1 -ml-1"
        >
          ← Back
        </button>
        <h1 className="font-bold text-white">{skill.name}</h1>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Skill Hero */}
        <div className={`mt-6 p-6 bg-[#1a1a1a] border rounded-2xl text-center relative overflow-hidden ${
          justLeveledUp ? 'animate-level-flash animate-glow-gold' : 'border-white/10'
        }`}>
          <div className="text-6xl mb-3">{skill.icon}</div>
          <div className="text-[80px] font-black leading-none" style={{ color: tier.color }}>
            {level}
          </div>
          <div className="text-sm font-bold mb-1" style={{ color: tier.color }}>{tier.label}</div>
          <div className="text-[#888] text-xs mb-4">{skill.name}</div>

          {/* XP Bar */}
          <div className="mb-2">
            <ProgressBar current={xpIn} max={xpNext} height="h-3" />
          </div>
          <div className="text-xs text-[#666]">{xpIn} / {xpNext} XP to Level {level + 1}</div>
          <div className="text-xs text-[#444] mt-1">Total XP: {skill.totalXP.toLocaleString()}</div>

          {/* Floating XP animation */}
          {addedXPAnim && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-[#00FF88] animate-float-up pointer-events-none z-10">
              {addedXPAnim}
            </div>
          )}

          {justLeveledUp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-4xl font-black text-[#FFD700] animate-bounce-in">
                LEVEL UP! 🎉
              </div>
            </div>
          )}
        </div>

        {/* XP Input */}
        <div className="mt-6 p-4 bg-[#1a1a1a] border border-white/10 rounded-2xl">
          <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">Log Progress</h3>

          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddXP()}
              placeholder="0"
              min="0"
              step="0.5"
              className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold text-center placeholder-[#333]"
              inputMode="decimal"
            />
            <div className="px-3 py-3 bg-[#111] border border-white/10 rounded-xl text-[#888] text-sm flex items-center min-w-16 justify-center">
              {skill.unit}s
            </div>
          </div>

          {/* XP Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="text-center mb-4 text-sm text-[#888]">
              = <span className="text-[#00FF88] font-bold">+{Math.round(parseFloat(amount) * skill.xpPerUnit)} XP</span>
              <span className="text-[#555] text-xs ml-1">({skill.xpPerUnit} XP per {skill.unit})</span>
            </div>
          )}

          <button
            onClick={handleAddXP}
            disabled={!amount || parseFloat(amount) <= 0}
            className="btn-gold-filled w-full py-4 rounded-xl font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Add XP
          </button>
        </div>

        {/* Level History */}
        {recentHistory.length > 0 && (
          <div className="mt-6 p-4 bg-[#1a1a1a] border border-white/10 rounded-2xl">
            <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">Recent Level-Ups</h3>
            <div className="flex flex-col gap-3">
              {recentHistory.map((entry, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-xs font-bold text-[#FFD700]">
                      {entry.level}
                    </div>
                    <div>
                      <div className="text-sm text-white">Reached Level {entry.level}</div>
                      <div className="text-xs text-[#555]">
                        {new Date(entry.gainedAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#FFD700]">+{entry.gold}G</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="mt-4 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full py-3 border border-white/10 rounded-xl text-sm text-[#666] hover:text-white hover:border-white/20 transition-all"
          >
            ⚙️ Customize XP Rate {showSettings ? '▲' : '▼'}
          </button>

          {showSettings && (
            <div className="mt-2 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl animate-bounce-in">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-[#666] block mb-1">XP per unit</label>
                  <input
                    type="number"
                    value={customXPPerUnit}
                    onChange={e => setCustomXPPerUnit(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[#666] block mb-1">Unit name</label>
                  <select
                    value={customUnit}
                    onChange={e => setCustomUnit(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSaveSettings}
                className="btn-gold w-full py-2 rounded-lg text-sm font-bold"
              >
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
