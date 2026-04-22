import { useEffect } from 'react'

export function useBinaryRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const FONT_SZ = 14
    const STEP = 2       // render every other column — halves GPU load
    const FPS = 20
    const FRAME_MS = 1000 / FPS
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

        if (y < 1) {
          ctx.fillStyle = '#00FF41'
        } else {
          const alpha = 0.05 + Math.random() * 0.4
          ctx.fillStyle = `rgba(0,204,51,${alpha})`
        }

        ctx.fillText(Math.random() > 0.5 ? '1' : '0', px, py)

        if (py > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] += 0.5
      }
    }

    init()
    const onResize = () => { cancelAnimationFrame(raf); init(); raf = requestAnimationFrame(draw) }
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
}
