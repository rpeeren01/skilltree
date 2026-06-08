import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore.js';
import { playCoin } from '../lib/sound.js';

export default function TopBar() {
  const gold = useStore(s => s.gold);
  const streakDays = useStore(s => s.streakDays);
  const soundEnabled = useStore(s => s.soundEnabled);
  const username = useStore(s => s.username);
  const prevGold = useRef(gold);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (gold > prevGold.current) {
      playCoin(soundEnabled);
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 400);
      prevGold.current = gold;
      return () => clearTimeout(t);
    }
    prevGold.current = gold;
  }, [gold, soundEnabled]);

  const streakBig = streakDays >= 7;
  const dollarValue = (gold / 100).toFixed(2);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{ background: '#0A0A0F', borderBottom: '1px solid #262636' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-xl tracking-tight" style={{ color: '#FFD700' }}>
          ASCEND
        </span>
        {username && (
          <span className="hidden sm:inline text-xs font-body" style={{ color: '#888899' }}>
            · {username}
          </span>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 cursor-default">
          <FlameIcon
            style={{ color: streakBig ? '#FFD700' : '#FF6B35' }}
            className={streakBig ? 'animate-glow-gold' : ''}
          />
          <span
            className="font-display font-bold text-sm"
            style={{ color: streakBig ? '#FFD700' : 'white' }}
          >
            {streakDays}
          </span>
          {streakBig && (
            <span className="text-[10px] font-display font-bold" style={{ color: '#FFD700' }}>
              +20% gold
            </span>
          )}
        </div>

        <div className={`flex items-center gap-1.5 cursor-default ${popping ? 'animate-coin-pop' : ''}`}>
          <CoinIcon style={{ color: '#FFD700' }} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-sm" style={{ color: '#FFD700' }}>
              {gold.toLocaleString()}
            </span>
            <span className="text-[9px]" style={{ color: '#888899' }}>
              ${dollarValue}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function FlameIcon({ style, className }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
      <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66-1.49-1.46-1.82-3.87-.87-5.7-.97.23-1.8.75-2.51 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12-.06-.05-.1-.1-.14-.17-1.13-1.43-1.31-3.48-.55-5.12C6.78 10 5.87 12.3 6 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26z"/>
    </svg>
  );
}

function CoinIcon({ style }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
    </svg>
  );
}
