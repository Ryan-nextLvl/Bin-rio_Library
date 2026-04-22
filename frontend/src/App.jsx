import { useRef, useState, useEffect, useMemo } from 'react'
import { useBinaryRain } from './hooks/useBinaryRain'
import { useTypingEffect } from './hooks/useTypingEffect'
import { useClock } from './hooks/useClock'

// ── Static data ──────────────────────────────────────────────
const SKILLS = {
  Backend:  ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'SQLite', 'Redis'],
  Frontend: ['React', 'Tailwind CSS', 'Vite', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  DevOps:   ['Git', 'Docker', 'GitHub Actions', 'Railway', 'Render', 'Linux'],
  Outros:   ['RPA', 'Playwright', 'Web Scraping', 'WhatsApp Bot', 'Automação'],
}

const EXPERIENCES = [
  {
    period: '2024 → Atual',
    role: 'Desenvolvedor em formação',
    company: '',
    tech: '',
    bullets: [
      'Desenvolvimento de projetos próprios',
      'Criação de APIs e sistemas com Django',
      'Automação de processos e integrações',
      'Estudo contínuo em backend e frontend',
    ],
  },
]

const SOCIAL = {
  github:   'https://github.com/Ryan-nextLvl',
  linkedin: '#',
  cv:       '#',
}

// ── Helpers ───────────────────────────────────────────────────
function getCsrf() {
  const m = document.cookie.match(/csrftoken=([^;]+)/)
  return m ? m[1] : ''
}

function extractTechs(projetos) {
  const set = new Set()
  projetos.forEach(p => {
    if (p.tecnologias) p.tecnologias.split(',').forEach(t => set.add(t.trim()))
  })
  return [...set].sort()
}

function CardImage({ nome }) {
  return (
    <div className="card-terminal-bar">
      <span className="card-terminal-dot" style={{ background: '#FF5F57' }} />
      <span className="card-terminal-dot" style={{ background: '#FFBD2E' }} />
      <span className="card-terminal-dot" style={{ background: '#28C840' }} />
      <span className="ml-auto text-xs" style={{ color: 'rgba(192,255,192,0.3)', fontSize: '0.6rem' }}>
        ~/{nome.toLowerCase().replace(/\s+/g, '-')}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function App() {
  const canvasRef = useRef(null)
  useBinaryRain(canvasRef)
  const typingText = useTypingEffect()
  const clock = useClock()

  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  useEffect(() => {
    fetch('/api/projetos/')
      .then(r => r.json())
      .then(data => { setProjetos(data.projetos || []); setLoading(false) })
      .catch(() => {
        // static fallback for GitHub Pages
        fetch('/projects.json')
          .then(r => r.json())
          .then(data => { setProjetos(data.projetos || []); setLoading(false) })
          .catch(() => setLoading(false))
      })
  }, [])

  async function handleAcessar(e, projetoId, url) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/visita/${projetoId}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrf() },
      })
      const data = await res.json()
      if (data.url && data.url !== '/') window.open(data.url, '_blank')
    } catch {
      if (url) window.open(url, '_blank')
    }
  }

  const allTechs = useMemo(() => extractTechs(projetos), [projetos])

  const filteredProjetos = useMemo(() => {
    const q = search.toLowerCase()
    return projetos.filter(p => {
      const matchSearch = !q ||
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        (p.tecnologias || '').toLowerCase().includes(q)
      const matchFilter = activeFilter === 'Todos' ||
        (p.tecnologias || '').split(',').map(t => t.trim()).includes(activeFilter)
      return matchSearch && matchFilter
    })
  }, [projetos, search, activeFilter])

  const featured = filteredProjetos.filter(p => p.destaque)
  const others = filteredProjetos.filter(p => !p.destaque)

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A', fontFamily: '"Fira Code", monospace', color: '#C0FFC0' }}>
      <canvas ref={canvasRef} id="binary-canvas" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(10,10,10,0.9)', borderColor: '#1A1A1A', backdropFilter: 'blur(6px)' }}>
        <div className="px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-base font-bold tracking-widest" style={{ color: '#00FF41' }}>
              &gt;_ {typingText}<span id="typing-cursor" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs" style={{ color: '#00CC33' }}>
            <a href="#projetos" className="hover:text-[#00FF41] transition-colors tracking-widest">PROJETOS</a>
            <a href="#skills" className="hover:text-[#00FF41] transition-colors tracking-widest">SKILLS</a>
            <a href="#experiencia" className="hover:text-[#00FF41] transition-colors tracking-widest">EXP</a>
          </div>
          <div className="text-xs tabular-nums" style={{ color: '#00CC33', opacity: 0.6 }}>{clock}</div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-grid relative z-10 px-6 md:px-12 py-20 md:py-28 border-b" style={{ borderColor: '#1A1A1A' }}>
        <div className="max-w-4xl">
          <p className="section-label mb-2">$ whoami</p>
          <h1 className="glitch-text text-4xl md:text-6xl font-bold tracking-widest leading-tight mb-6" style={{ color: '#00FF41' }}>
            RYAN<br />
            <span style={{ color: '#C0FFC0', fontSize: '0.55em' }}>DEVELOPER EM FORMAÇÃO</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(192,255,192,0.65)' }}>
            Estudante de Engenharia de Software focado em backend com{' '}
            <span style={{ color: '#00FF41' }}>Python/Django</span> e automação.
            Construindo projetos reais e evoluindo para fullstack.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-10 text-xs" style={{ color: '#00CC33' }}>
            {[
              { label: 'projetos', value: projetos.length },
              { label: 'tecnologias', value: allTechs.length || 15 },
              { label: 'anos exp.', value: 3 },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: '#00FF41' }}>{s.value}</span>
                <span style={{ opacity: 0.6 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="btn-neon">
              <GitHubIcon /> GITHUB
            </a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="btn-neon btn-neon-ghost">
              <LinkedInIcon /> LINKEDIN
            </a>
            <a href={SOCIAL.cv} className="btn-neon btn-neon-ghost">
              <DownloadIcon /> DOWNLOAD CV
            </a>
          </div>
        </div>
      </section>

      <main className="relative z-10 px-6 md:px-12 py-14">

        {/* ── Skills ── */}
        <section id="skills" className="mb-20">
          <p className="section-label">$ cat skills.json</p>
          <h2 className="section-title mb-8">SKILLS</h2>
          <div className="neon-divider mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SKILLS).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs mb-3 font-bold tracking-widest" style={{ color: '#00FF41' }}>// {cat}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="skill-badge">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projetos" className="mb-20">
          <p className="section-label">$ ls -la projetos/</p>
          <h2 className="section-title mb-2">PROJETOS</h2>
          <p className="text-xs mb-8" style={{ color: 'rgba(192,255,192,0.4)' }}>
            // {filteredProjetos.length} de {projetos.length} item(s) encontrado(s)
          </p>
          <div className="neon-divider mb-8" />

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon />
              <input
                type="text"
                className="search-input"
                placeholder="buscar projeto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Todos', ...allTechs].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveFilter(t)}
                  className={`tech-chip ${activeFilter === t ? 'active' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24 text-sm" style={{ color: '#00CC33' }}>
              <span className="animate-pulse">inicializando projetos...</span>
            </div>
          ) : filteredProjetos.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3" style={{ color: '#00CC33' }}>[ ]</p>
              <p className="text-xs" style={{ color: 'rgba(192,255,192,0.4)' }}>// nenhum resultado para "{search}"</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs mb-4 tracking-widest" style={{ color: '#00CC33' }}>// em destaque</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featured.map((p, idx) => <ProjectCard key={p.id} projeto={p} idx={idx} onAcessar={handleAcessar} featured />)}
                  </div>
                </div>
              )}
              {/* Others */}
              {others.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((p, idx) => <ProjectCard key={p.id} projeto={p} idx={featured.length + idx} onAcessar={handleAcessar} />)}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Experience ── */}
        <section id="experiencia" className="mb-12">
          <p className="section-label">$ cat resume.json</p>
          <h2 className="section-title mb-8">EXPERIENCIAS</h2>
          <div className="neon-divider mb-8" />

          <div className="relative pl-8 max-w-3xl">
            <div className="timeline-line" />
            {EXPERIENCES.map((item, i) => (
              <div key={i} className="relative timeline-item mb-10">
                <span className="text-xs" style={{ color: '#00CC33', opacity: 0.7 }}>{item.period}</span>
                <h3 className="font-bold mt-1 tracking-wide" style={{ color: '#00FF41' }}>{item.role}</h3>
                {(item.company || item.tech) && (
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(192,255,192,0.6)' }}>
                    {item.company}{item.company && item.tech && <>&nbsp;|&nbsp;</>}
                    <span style={{ color: '#00CC33' }}>{item.tech}</span>
                  </p>
                )}
                {item.bullets ? (
                  <ul className="mt-2 space-y-1">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="text-xs flex gap-2" style={{ color: 'rgba(192,255,192,0.5)' }}>
                        <span style={{ color: '#00FF41' }}>-</span> {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(192,255,192,0.45)' }}>{item.desc}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-start">
            <a
              href={SOCIAL.cv}
              className="btn-neon relative"
              style={{ fontSize: '0.75rem', padding: '0.6rem 1.5rem' }}
            >
              <span className="absolute inset-0 border animate-pulse pointer-events-none" style={{ borderColor: '#00FF41', opacity: 0.3 }} />
              <DownloadIcon /> &gt; DOWNLOAD CV
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t mt-8" style={{ borderColor: '#1A1A1A' }}>
        <div className="px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs" style={{ color: 'rgba(0,204,51,0.5)' }}>
            bin-rio_library &nbsp;·&nbsp; {projetos.length} projetos &nbsp;·&nbsp; status: online
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#00CC33' }}>
            <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="hover:text-[#00FF41] transition-colors">GitHub</a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#00FF41] transition-colors">LinkedIn</a>
            <span style={{ opacity: 0.3 }}>// {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Project Card ──────────────────────────────────────────────
function ProjectCard({ projeto, idx, onAcessar, featured = false }) {
  const techs = (projeto.tecnologias || '').split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div className="project-card flex flex-col">
      <CardImage nome={projeto.nome} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold" style={{ color: 'rgba(0,204,51,0.5)', fontSize: '0.6rem' }}>
              [PROJ_{String(idx + 1).padStart(3, '0')}]
            </span>
            {featured && (
              <span className="featured-badge">★ DESTAQUE</span>
            )}
            {projeto.visitas >= 100 && (
              <span className="text-xs" style={{ color: '#00FF41' }}>🔥</span>
            )}
          </div>
        </div>

        <h2 className="font-bold text-base tracking-wide mb-2" style={{ color: '#C0FFC0' }}>
          {projeto.nome}
        </h2>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {techs.slice(0, 4).map(t => (
            <span key={t} className="tech-chip" style={{ cursor: 'default' }}>{t}</span>
          ))}
          {techs.length > 4 && (
            <span className="tech-chip" style={{ cursor: 'default', opacity: 0.5 }}>+{techs.length - 4}</span>
          )}
          {projeto.status && (
            <span className="tech-chip" style={{
              cursor: 'default',
              borderColor: projeto.status === 'Ativo' ? '#00FF41' : projeto.status === 'Funcional' ? '#00CC33' : '#1A1A1A',
              color: projeto.status === 'Ativo' ? '#00FF41' : projeto.status === 'Funcional' ? '#00CC33' : 'rgba(192,255,192,0.4)',
            }}>
              {projeto.status === 'Ativo' ? '● ' : projeto.status === 'Funcional' ? '● ' : '○ '}{projeto.status}
            </span>
          )}
        </div>

        <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: 'rgba(192,255,192,0.5)' }}>
          {projeto.descricao}
        </p>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1A1A1A' }}>
          <span className="text-xs" style={{ color: 'rgba(0,204,51,0.45)', fontSize: '0.6rem' }}>
            <span style={{ color: '#00CC33' }}>👁</span> {projeto.visitas} visita(s)
          </span>
          <div className="flex gap-2">
            {projeto.url_github && (
              <a href={projeto.url_github} target="_blank" rel="noreferrer" className="btn-neon btn-neon-ghost" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>
                <GitHubIcon size={10} /> CODE
              </a>
            )}
            {projeto.url_site ? (
              <a
                href={projeto.url_site}
                onClick={e => onAcessar(e, projeto.id, projeto.url_site)}
                target="_blank"
                rel="noreferrer"
                className="btn-neon"
                style={{ fontSize: '0.6rem', padding: '0.3rem 0.7rem' }}
              >
                &gt; LIVE
              </a>
            ) : (
              <span className="text-xs italic" style={{ color: 'rgba(0,204,51,0.3)', fontSize: '0.6rem' }}>// em breve</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Inline SVG icons ─────────────────────────────────────────
function GitHubIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,204,51,0.5)', pointerEvents: 'none' }}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}
