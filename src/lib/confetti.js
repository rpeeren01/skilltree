import confetti from 'canvas-confetti'

export function fireConfetti() {
  // Multi-burst confetti for level ups
  const duration = 1500
  const end = Date.now() + duration

  const colors = ['#FFD700', '#FFC107', '#00D9FF', '#00FF88', '#ffffff']

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      gravity: 1.2,
      scalar: 1.2,
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      gravity: 1.2,
      scalar: 1.2,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

export function fireMiniConfetti(origin = { x: 0.5, y: 0.5 }) {
  confetti({
    particleCount: 30,
    spread: 60,
    origin,
    colors: ['#FFD700', '#00D9FF', '#00FF88'],
    gravity: 1.5,
    scalar: 0.8,
  })
}
