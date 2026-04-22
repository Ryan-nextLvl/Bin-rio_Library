import { useEffect } from 'react'

export function useBinaryRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const FONT_SZ = 14
    const STEP = 2
    const FRAME_MS = 1000 / 20
    let cols, drops, raf, last = 0

    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.ceil(canvas.width / (FONT_SZ * STEP))
      drops = Array.from({ length: cols }, () => Math.random() * -60)
    }

    function draw(ts) {
      raf = requestAnimationFrame(draw)
      if (ts - last < FRAME_MS) return
      last = ts

      ctx.fillStyle = 'rgba(10,10,10,0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SZ}px "Fira Code", monospace`

      for (let i = 0; i < cols; i++) {
        const y = drops[i]
        const px = i * FONT_SZ * STEP
        const py = y * FONT_SZ

        ctx.fillStyle = y < 1 ? '#00FF41' : `rgba(0,204,51,${0.05 + Math.random() * 0.4})`
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', px, py)

        if (py > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] += 0.5
      }
    }

    // Quando a aba volta a ficar visível, reseta o timer para evitar salto
    function onVisibility() {
      if (!document.hidden) last = 0
    }

    init()
    const onResize = () => { cancelAnimationFrame(raf); init(); raf = requestAnimationFrame(draw) }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canvasRef])
}
