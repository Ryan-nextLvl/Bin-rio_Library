import { useRef, useEffect, useState } from 'react'
import { useBinaryRain } from './hooks/useBinaryRain'
import { useTypingEffect } from './hooks/useTypingEffect'
import { useClock } from './hooks/useClock'

export default function App() {
  const canvasRef = useRef(null)
  useBinaryRain(canvasRef)
  const typingText = useTypingEffect()
  const clock = useClock()
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projetos/')
      .then(r => r.json())
      .then(data => {
        setProjetos(data.projetos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleAcessar(e, projetoId) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/visita/${projetoId}/`, { method: 'POST', headers: { 'X-CSRFToken': getCsrf() } })
      const data = await res.json()
      if (data.url && data.url !== '/') window.open(data.url, '_blank')
    } catch {
      // fallback: ignore
    }
  }

  function getCsrf() {
    const m = document.cookie.match(/csrftoken=([^;]+)/)
    return m ? m[1] : ''
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A', fontFamily: '"Fira Code", monospace', color: '#C0FFC0' }}>
      <canvas ref={canvasRef} id="binary-canvas" />

      <header className="border-b py-6 px-6 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10" style={{ borderColor: '#1F1F1F' }}>
        <div>
          <div className="text-xl font-bold tracking-widest" style={{ color: '#00FF41' }}>
            &gt;_ {typingText}<span id="typing-cursor" />
          </div>
          <p className="text-xs mt-1 tracking-widest" style={{ color: '#00CC33' }}>// repositorio de projetos</p>
        </div>
        <div className="text-xs" style={{ color: '#00CC33' }}>{clock}</div>
      </header>

      <main className="relative z-10 px-6 md:px-12 py-10">
        <div className="mb-8">
          <p className="text-sm" style={{ color: '#00CC33' }}>
            <span style={{ color: '#00FF41' }}>$</span> ls -la projetos/{' '}
            <span style={{ opacity: 0.6, color: '#C0FFC0' }}>// {projetos.length} item(s) encontrado(s)</span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24" style={{ color: '#00CC33' }}>
            <p className="animate-pulse">carregando projetos...</p>
          </div>
        ) : projetos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto, idx) => (
              <div
                key={projeto.id}
                className="rounded-sm p-6 flex flex-col justify-between transition-all duration-300 ease-in-out"
                style={{ background: '#0F0F0F', border: '1px solid #1F1F1F' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00FF41'; e.currentTarget.style.boxShadow = '0 0 8px #00FF41, 0 0 20px rgba(0,255,65,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1F1F1F'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs" style={{ color: '#00FF41' }}>[PROJ_{String(idx + 1).padStart(3, '0')}]</span>
                    {projeto.visitas >= 100 && <span className="text-xs">🔥</span>}
                  </div>
                  <h2 className="font-bold text-lg transition-colors duration-200" style={{ color: '#C0FFC0' }}>
                    {projeto.nome}
                  </h2>
                  {projeto.tecnologias && (
                    <p className="text-xs mt-2" style={{ color: '#00CC33', opacity: 0.7 }}>// {projeto.tecnologias}</p>
                  )}
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: '#C0FFC0', opacity: 0.6 }}>
                    {projeto.descricao}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#00CC33', opacity: 0.6 }}>
                    <span style={{ color: '#00FF41' }}>👁</span> {projeto.visitas} visita(s)
                  </span>
                  {projeto.url_site ? (
                    <a
                      href={projeto.url_site}
                      onClick={e => handleAcessar(e, projeto.id)}
                      className="inline-block text-xs font-bold px-4 py-2 tracking-widest transition-all duration-200"
                      style={{ border: '1px solid #00FF41', color: '#00FF41' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#00FF41'; e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.boxShadow = '0 0 8px #00FF41, 0 0 20px rgba(0,255,65,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00FF41'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      &gt; ACESSAR
                    </a>
                  ) : (
                    <span className="text-xs italic" style={{ color: '#00CC33', opacity: 0.4 }}>// sem URL</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-4xl mb-4" style={{ color: '#00CC33' }}>[ ]</p>
            <p className="text-sm" style={{ color: '#C0FFC0', opacity: 0.4 }}>// nenhum projeto encontrado</p>
            <p className="text-xs mt-2" style={{ color: '#00CC33', opacity: 0.3 }}>$ find . -name "*.projeto" --{'>'}0 results</p>
          </div>
        )}

        <section className="mt-24">
          <div className="mb-10">
            <p className="text-sm mb-1" style={{ color: '#00CC33' }}>
              <span style={{ color: '#00FF41' }}>$</span> cat resume.json
            </p>
            <h2 className="text-2xl font-bold tracking-widest" style={{ color: '#00FF41' }}>EXPERIENCIAS</h2>
            <div className="h-px mt-4" style={{ background: '#1F1F1F' }} />
          </div>

          <div className="relative pl-8">
            <div className="timeline-line" />
            {[
              {
                period: '2024 → presente',
                role: 'Desenvolvedor Back-end',
                company: 'Empresa XYZ',
                tech: 'Python · Django · PostgreSQL',
                desc: 'Desenvolvimento e manutencao de APIs REST, automacao de processos internos e integracao com servicos externos.',
              },
              {
                period: '2022 → 2024',
                role: 'Desenvolvedor Full-stack Jr.',
                company: 'Freelancer',
                tech: 'Django · React · Tailwind',
                desc: 'Criacao de sistemas web sob demanda para pequenas e medias empresas, com foco em UX e performance.',
              },
              {
                period: '2021 → 2022',
                role: 'Estudos & Projetos Pessoais',
                company: 'Autodidata',
                tech: 'Python · Automacao · Bots',
                desc: 'Imersao em programacao com foco em automacao, web scraping e desenvolvimento de ferramentas internas.',
              },
            ].map((item, i) => (
              <div key={i} className="relative timeline-item mb-10">
                <span className="text-xs" style={{ color: '#00CC33' }}>{item.period}</span>
                <h3 className="font-bold mt-1" style={{ color: '#00FF41' }}>{item.role}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#C0FFC0', opacity: 0.7 }}>
                  {item.company} &nbsp;|&nbsp; {item.tech}
                </p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: '#C0FFC0', opacity: 0.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#"
              className="relative inline-flex items-center gap-3 font-bold px-8 py-3 tracking-widest text-sm transition-all duration-200"
              style={{ border: '1px solid #00FF41', color: '#00FF41' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00FF41'; e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.boxShadow = '0 0 16px #00FF41, 0 0 40px rgba(0,255,65,0.27)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00FF41'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <span className="absolute inset-0 rounded-sm border animate-pulse pointer-events-none" style={{ borderColor: '#00FF41', opacity: 0.5 }} />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
              </svg>
              &gt; DOWNLOAD CV
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t mt-24 py-4 px-8 text-center text-xs" style={{ borderColor: '#1F1F1F', color: '#00CC33', opacity: 0.4 }}>
        bin-rio_library &nbsp;|&nbsp; {projetos.length} projetos carregados
      </footer>
    </div>
  )
}
