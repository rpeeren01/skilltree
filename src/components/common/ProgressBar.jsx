export function ProgressBar({ current, max, color = null, height = 'h-2', showText = false, animated = true }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0

  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${height}`}>
      <div
        className={`${height} rounded-full ${animated ? 'xp-bar-fill' : ''} ${color ? '' : 'progress-gradient'}`}
        style={{
          width: `${pct}%`,
          minWidth: pct > 0 ? '4px' : '0',
          background: color || undefined,
        }}
      />
      {showText && (
        <div className="text-xs text-[#888] mt-1 text-right">{current}/{max}</div>
      )}
    </div>
  )
}
