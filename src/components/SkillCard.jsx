import { xpForLevel } from '../lib/leveling.js';
import SkillIcon from './SkillIcon.jsx';

export default function SkillCard({ skill, onClick, skinType }) {
  const { name, level, currentXP, id } = skill;
  const needed = xpForLevel(level);
  const pct = Math.min((currentXP / needed) * 100, 100);
  const remaining = needed - currentXP;

  const isNeonSkin = skinType === 'skin-neon';
  const isGoldSkin = skinType === 'skin-gold';
  const isMinimalSkin = skinType === 'skin-minimal';

  let cardBorder = '#262636';
  let cardBg = '#13131D';
  if (isNeonSkin) { cardBorder = '#00F0FF'; cardBg = '#0D1F24'; }
  if (isGoldSkin) { cardBorder = '#FFD700'; cardBg = '#1C1800'; }
  if (isMinimalSkin) { cardBorder = '#333344'; cardBg = '#0F0F18'; }

  return (
    <button
      onClick={onClick}
      className="skill-card w-full text-left rounded-2xl p-4 cursor-pointer"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 42, height: 42, background: 'rgba(255,215,0,0.1)', color: '#FFD700' }}
        >
          <SkillIcon id={id} size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-bold text-sm truncate text-white">{name}</span>
            <span
              className="flex-shrink-0 text-xs font-display font-black rounded-full px-2 py-0.5"
              style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
            >
              Lv {level}
            </span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: '#888899' }}>
            {remaining.toLocaleString()} XP to next level
          </p>
        </div>
      </div>

      <div className="relative rounded-full overflow-hidden" style={{ height: 6, background: '#262636' }}>
        <div
          className="xp-bar-fill absolute inset-y-0 left-0 rounded-full progress-gradient"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: '#888899' }}>{currentXP.toLocaleString()} XP</span>
        <span className="text-[10px]" style={{ color: '#888899' }}>{needed.toLocaleString()} XP</span>
      </div>
    </button>
  );
}
