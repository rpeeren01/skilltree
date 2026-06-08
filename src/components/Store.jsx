import { useState } from 'react'
import { useGameStore } from '../lib/gameStore'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'skins', label: 'Skins' },
  { id: 'avatars', label: 'Avatars' },
  { id: 'titles', label: 'Titles' },
]

export function Store() {
  const { gold, storeItems, spendingBalance, buyItem, convertGold } = useGameStore()
  const [activeCategory, setActiveCategory] = useState('all')
  const [convertAmount, setConvertAmount] = useState('')
  const [convertModal, setConvertModal] = useState(false)

  const filteredItems = activeCategory === 'all'
    ? storeItems
    : storeItems.filter(i => i.category === activeCategory)

  const handleBuy = (item) => {
    if (item.owned) return
    if (gold < item.price) {
      useGameStore.getState().addToast({
        type: 'default',
        message: `Need ${item.price - gold} more Gold for ${item.name}`,
        duration: 3000,
      })
      return
    }
    buyItem(item.id)
  }

  const handleConvert = () => {
    const amt = parseInt(convertAmount)
    if (!amt || amt <= 0 || amt > gold) return
    convertGold(amt)
    setConvertAmount('')
    setConvertModal(false)
  }

  const dollarPreview = convertAmount ? (parseInt(convertAmount) / 100).toFixed(2) : '0.00'

  return (
    <div className="page-enter pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Gold Store</h1>
            <div className="text-xs text-[#666]">Spend your hard-earned rewards</div>
          </div>
          <div className="text-right">
            <div className="text-[#FFD700] font-bold text-lg">{gold.toLocaleString()}G</div>
            <div className="text-[10px] text-[#555]">balance</div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* Real Money Converter */}
        <div className="mt-4 p-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FFC107]/5 border border-[#FFD700]/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-bold text-[#FFD700]">💵 Real Money Converter</div>
              <div className="text-xs text-[#888] mt-0.5">1,000 Gold = $10</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#888]">Spending Balance</div>
              <div className="text-lg font-bold text-[#00FF88]">${spendingBalance.toFixed(2)}</div>
            </div>
          </div>

          <button
            onClick={() => setConvertModal(true)}
            disabled={gold < 100}
            className="btn-gold w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Convert Gold → Real Money
          </button>

          {gold < 100 && (
            <div className="text-xs text-[#555] text-center mt-2">Need at least 100G to convert ($1.00)</div>
          )}
        </div>

        {/* Convert Modal */}
        {convertModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4" onClick={() => setConvertModal(false)}>
            <div className="bg-[#1a1a1a] border border-[#FFD700]/30 rounded-2xl p-6 w-full max-w-sm animate-bounce-in" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">Convert Gold</h3>

              <div className="mb-4">
                <label className="text-xs text-[#666] block mb-2">Gold to convert (min 100G)</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={e => setConvertAmount(e.target.value)}
                  placeholder="1000"
                  min="100"
                  max={gold}
                  step="100"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold text-center"
                  inputMode="numeric"
                />
                <div className="text-center mt-2 text-sm text-[#888]">
                  = <span className="text-[#00FF88] font-bold">${dollarPreview}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setConvertModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-[#888] text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  disabled={!convertAmount || parseInt(convertAmount) < 100 || parseInt(convertAmount) > gold}
                  className="flex-1 btn-gold-filled py-3 rounded-xl text-sm font-bold disabled:opacity-40"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1a1a1a] border border-white/10 text-[#888] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-[#1a1a1a] border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                item.owned
                  ? 'border-[#00FF88]/30 opacity-75'
                  : gold >= item.price
                  ? 'border-white/10 hover:border-[#FFD700]/40 cursor-pointer'
                  : 'border-white/5 opacity-50'
              }`}
              onClick={() => !item.owned && handleBuy(item)}
            >
              <div className="text-4xl text-center">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-white text-center">{item.name}</div>
                <div className="text-xs text-[#555] text-center mt-0.5">{item.description}</div>
              </div>
              <div className="mt-auto">
                {item.owned ? (
                  <div className="text-center text-xs text-[#00FF88] font-bold">✅ Owned</div>
                ) : (
                  <div className={`text-center text-sm font-bold ${gold >= item.price ? 'text-[#FFD700]' : 'text-[#555]'}`}>
                    🪙 {item.price}G
                  </div>
                )}
                <div className="text-center text-[10px] text-[#444] mt-0.5">
                  ${(item.price / 100).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 mb-6 text-center text-xs text-[#333]">
          More items coming soon... 👀
        </div>
      </div>
    </div>
  )
}
