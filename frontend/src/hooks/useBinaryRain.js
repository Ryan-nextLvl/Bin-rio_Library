import { useEffect } from 'react'

export function useBinaryRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const FONT_SZ = 13
    let cols, drops

    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / FONT_SZ)
      drops = Array.from({ length: cols }, () => Math.random() * -50)
    }

    function draw() {
      ctx.fillStyle = 'rgba(10,10,10,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SZ}px "Fira Code", monospace`
      drops.forEach((y, i) => {
        const bit = Math.random() > 0.5 ? '1' : '0'
        const x = i * FONT_SZ
        ctx.fillStyle = y < 1 ? '#00FF41' : `rgba(0,204,51,${Math.random() * 0.5 + 0.05})`
        ctx.fillText(bit, x, y * FONT_SZ)
        if (y * FONT_SZ > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.5
      })
    }

    init()
    window.addEventListener('resize', init)
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', init)
    }
  }, [canvasRef])
}
