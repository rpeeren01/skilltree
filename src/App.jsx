import { useEffect } from 'react'
import { useGameStore } from './lib/gameStore'
import { Home } from './components/Home'
import { SkillDetail } from './components/SkillDetail'
import { Quests } from './components/Quests'
import { Store } from './components/Store'
import { Settings } from './components/Settings'
import { BottomNav, SideNav } from './components/common/BottomNav'
import { ToastContainer } from './components/common/Toast'

function App() {
  const activeScreen = useGameStore(s => s.activeScreen)
  const checkQuestReset = useGameStore(s => s.checkQuestReset)

  useEffect(() => {
    checkQuestReset()
    // Check quest reset every 5 minutes
    const interval = setInterval(checkQuestReset, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <Home />
      case 'skill-detail': return <SkillDetail />
      case 'quests': return <Quests />
      case 'store': return <Store />
      case 'settings': return <Settings />
      default: return <Home />
    }
  }

  const showNav = activeScreen !== 'skill-detail'

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Desktop sidebar */}
      {showNav && <SideNav />}

      {/* Main content */}
      <main className={`${showNav ? 'lg:ml-64' : ''} min-h-screen`}>
        {renderScreen()}
      </main>

      {/* Mobile bottom nav */}
      {showNav && <BottomNav />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}

export default App
