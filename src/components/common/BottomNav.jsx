import { useGameStore } from '../../lib/gameStore'

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'quests', icon: '📋', label: 'Quests' },
  { id: 'store', icon: '🏪', label: 'Store' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export function BottomNav() {
  const activeScreen = useGameStore(s => s.activeScreen)
  const setScreen = useGameStore(s => s.setScreen)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 bottom-nav z-40 lg:hidden">
      <div className="flex">
        {NAV_ITEMS.map(item => {
          const isActive = activeScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${
                isActive ? 'text-[#FFD700]' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#FFD700] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Sidebar for desktop
export function SideNav() {
  const activeScreen = useGameStore(s => s.activeScreen)
  const setScreen = useGameStore(s => s.setScreen)
  const gold = useGameStore(s => s.gold)
  const username = useGameStore(s => s.username)
  const streakDays = useGameStore(s => s.streakDays)

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#111] border-r border-white/10 fixed left-0 top-0 bottom-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold text-lg">
            {username.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white">{username}</div>
            <div className="text-xs text-[#666]">Entrepreneur</div>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400 text-lg">🪙</span>
            <span className="text-[#FFD700] font-bold">{gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🔥</span>
            <span className="text-orange-400 font-bold">{streakDays}</span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col p-3 gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30'
                  : 'text-[#666] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
