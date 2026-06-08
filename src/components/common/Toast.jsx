import { useGameStore } from '../../lib/gameStore'

const TOAST_STYLES = {
  'level-up': 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFC107]/10 border-[#FFD700] text-[#FFD700]',
  'quest': 'bg-gradient-to-r from-[#00FF88]/20 to-[#00D9FF]/10 border-[#00FF88] text-[#00FF88]',
  'purchase': 'bg-gradient-to-r from-[#9D4EDD]/20 to-[#7B2FBE]/10 border-[#9D4EDD] text-white',
  'convert': 'bg-gradient-to-r from-[#00D9FF]/20 to-[#006AFF]/10 border-[#00D9FF] text-[#00D9FF]',
  'default': 'bg-[#222] border-white/20 text-white',
}

const TOAST_ICONS = {
  'level-up': '⚔️',
  'quest': '🏆',
  'purchase': '🛍️',
  'convert': '💵',
  'default': 'ℹ️',
}

export function ToastContainer() {
  const toasts = useGameStore(s => s.toasts)

  return (
    <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-in px-4 py-3 rounded-xl border flex items-center gap-3 shadow-lg max-w-sm w-full pointer-events-auto ${
            TOAST_STYLES[toast.type] || TOAST_STYLES.default
          }`}
        >
          <span className="text-lg">{TOAST_ICONS[toast.type] || '⚡'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
