import { useEffect, useState } from 'react'

const PHRASES = ['BIN-RIO LIBRARY', 'RYAN.DEV', 'HACK THE PLANET', 'PROJETOS // v2.0']

export function useTypingEffect() {
  const [text, setText] = useState('')

  useEffect(() => {
    let phraseIdx = 0, charIdx = 0, deleting = false
    let timeout

    function type() {
      const phrase = PHRASES[phraseIdx]
      if (!deleting) {
        charIdx++
        setText(phrase.slice(0, charIdx))
        if (charIdx === phrase.length) {
          deleting = true
          timeout = setTimeout(type, 2000)
          return
        }
        timeout = setTimeout(type, 80)
      } else {
        charIdx--
        setText(phrase.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          phraseIdx = (phraseIdx + 1) % PHRASES.length
          timeout = setTimeout(type, 400)
          return
        }
        timeout = setTimeout(type, 40)
      }
    }

    type()
    return () => clearTimeout(timeout)
  }, [])

  return text
}
