import { useEffect, useState } from 'react'
import './App.css'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme | null {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* ignore */
  }
  return null
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark'
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme()
    if (stored) return stored
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'dark'
  })
  const gallery = [
    {
      category: 'Maquillaje Editorial / Artístico',
      items: [
        {
          title: 'Avatar',
          src: '/img/6.jpeg',
          note: 'Contrastes fríos + detalle artístico para un look editorial.',
        },
        {
          title: 'Diablita',
          src: '/img/5.jpeg',
          note: 'Intensidad, delineado y actitud: glamour con carácter.',
        },
        {
          title: 'Corazones en los ojos',
          src: '/img/16.jpeg',
          note: 'Romántico y gráfico: el maquillaje como símbolo.',
        },
      ],
    },
    {
      category: 'Maquillaje Social / Glow',
      items: [
        {
          title: 'Glow suave',
          src: '/img/4.jpeg',
          note: 'Piel luminosa, acabados pulidos y elegancia natural.',
        },
        {
          title: 'Noche chic',
          src: '/img/8.jpeg',
          note: 'Brillo controlado + mirada protagonista.',
        },
      ],
    },
    {
      category: 'Efectos Especiales',
      items: [
        {
          title: 'Fantasmas',
          src: '/img/15.jpeg',
          note: 'Texturas, sombras y narrativa para un look temático.',
        },
      ],
    },
  ] as const

  const [lightbox, setLightbox] = useState<{
    src: string
    title: string
    note: string
  } | null>(null)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (els.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )

    for (const el of els) io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightbox])

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#inicio" onClick={onNavClick}>
          <span className="brand-mark" aria-hidden="true">
            <InkStroke />
          </span>
          <span className="brand-text">Yulieth Anais</span>
        </a>
        <nav className="nav" aria-label="Secciones">
          <a href="#inicio" onClick={onNavClick}>
            Inicio
          </a>
          <a href="#sobre-mi" onClick={onNavClick}>
            Sobre mí
          </a>
          <a href="#galeria" onClick={onNavClick}>
            Galería
          </a>
          <a href="#contacto" onClick={onNavClick}>
            Contacto
          </a>
        </nav>
        <div className="topbar-end">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <a className="cta" href="#galeria" onClick={onNavClick}>
            Explorar mi Arte
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="section hero">
          <div className="hero-bg" aria-hidden="true">
            <GridGlow />
          </div>
          <div className="container hero-inner">
            <div className="hero-copy reveal">
              <p className="kicker">MA · KEYULIETH · CANTO · PORTAFOLIO 2026</p>
              <h1>
                Yulieth Anais:
                <br />
                <span className="hero-accent">El Maquillaje como Expresión</span>
              </h1>
              <p className="lead">
                Maquillaje editorial, social y creativo. Cada look es una historia
                — una mezcla de color, detalle y emoción.
              </p>
              <div className="hero-actions">
                <a className="btn primary" href="#galeria" onClick={onNavClick}>
                  Explorar mi Arte
                </a>
                <a className="btn ghost" href="#contacto" onClick={onNavClick}>
                  Reservar / Contactar
                </a>
              </div>
              <div className="hero-chips" aria-label="Información rápida">
                <a className="chip" href="https://instagram.com/its.yulieth_anais02" target="_blank" rel="noreferrer">
                  <InstagramIcon />
                  <span>@its.yulieth_anais02</span>
                </a>
                <a className="chip" href="mailto:yuliethanaisc02@gmail.com">
                  <MailIcon />
                  <span>yuliethanaisc02@gmail.com</span>
                </a>
                <a className="chip" href="https://wa.me/50763721082" target="_blank" rel="noreferrer">
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="hero-visual reveal">
              <figure className="hero-card">
                <div className="hero-card-media">
                  <ArtworkFrame
                    src="/img/1.jpeg"
                    alt="Maquillaje artístico de Yulieth Anais"
                    label="Look destacado"
                  />
                </div>
                <figcaption className="hero-card-caption">
                  “Transformando ideas en algo único”
                </figcaption>
              </figure>

              <div className="ornaments" aria-hidden="true">
                <Lipstick />
                <Brush />
                <Compact />
              </div>
            </div>
          </div>
        </section>

        <section id="sobre-mi" className="section about">
          <div className="container">
            <div className="section-head reveal">
              <p className="kicker">Esencia y Pasión</p>
              <h2>Sobre mí</h2>
            </div>
            <div className="about-grid">
              <div className="about-copy reveal">
                <p className="quote">
                  Mi nombre es Yulieth Anais y me apasiona el mundo de la belleza,
                  el maquillaje y la creatividad. Disfruto explorar nuevas ideas,
                  colores y estilos, utilizando el maquillaje como una forma de
                  expresión que refleja mi personalidad y mi imaginación.
                </p>
                <p className="quote">
                  Este espacio representa una parte de mí, donde comparto mi
                  esencia, mi gusto por los detalles y mi interés por todo lo que
                  me inspira a crear y experimentar.
                </p>
                <p className="quote">
                  Estoy abierta a nuevas oportunidades que me permitan seguir
                  creciendo, aprendiendo y desarrollando mi creatividad en el
                  mundo de la belleza. ¡Gracias por estar aquí!
                </p>
                <div className="callout">
                  <span className="callout-accent" aria-hidden="true" />
                  <div>
                    <p className="callout-title">Frase destacada</p>
                    <p className="callout-body">Transformando ideas en algo único.</p>
                  </div>
                </div>
              </div>
              <div className="about-visual reveal">
                <div className="about-photo">
                  <ArtworkFrame
                    src="/img/4.jpeg"
                    alt="Foto profesional de Yulieth Anais"
                    label="Sobre mí"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="galeria" className="section gallery">
          <div className="container">
            <div className="section-head reveal">
              <p className="kicker">Algunos de mis trabajos</p>
              <h2>Galería</h2>
              <p className="muted">
                Pasa el cursor para leer la inspiración. Haz clic en una foto para
                verla en grande.
              </p>
            </div>

            <div className="gallery-groups">
              {gallery.map((group) => (
                <section key={group.category} className="gallery-group">
                  <h3 className="gallery-title reveal">{group.category}</h3>
                  <div className="grid">
                    {group.items.map((item) => (
                      <FigureCard
                        key={item.title}
                        title={item.title}
                        src={item.src}
                        note={item.note}
                        onOpen={() =>
                          setLightbox({
                            src: item.src,
                            title: item.title,
                            note: item.note,
                          })
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="section contact">
          <div className="container">
            <div className="section-head reveal">
              <p className="kicker">Contacto y redes</p>
              <h2>Hablemos</h2>
            </div>

            <div className="contact-grid">
              <form
                className="form reveal"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <label>
                  <span>Nombre</span>
                  <input name="name" placeholder="Tu nombre" autoComplete="name" />
                </label>
                <label>
                  <span>Correo</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </label>
                <label className="full">
                  <span>Mensaje</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Cuéntame qué look o servicio necesitas…"
                  />
                </label>
                <div className="form-actions full">
                  <button className="btn primary" type="submit">
                    Enviar (demo)
                  </button>
                  <a className="btn ghost" href="https://wa.me/50763721082" target="_blank" rel="noreferrer">
                    Escribir por WhatsApp
                  </a>
                </div>
              </form>

              <aside className="contact-aside reveal">
                <div className="card">
                  <p className="card-title">Datos directos</p>
                  <a className="contact-link" href="https://wa.me/50763721082" target="_blank" rel="noreferrer">
                    <WhatsAppIcon />
                    <span>+507 6372-1082</span>
                  </a>
                  <a className="contact-link" href="mailto:yuliethanaisc02@gmail.com">
                    <MailIcon />
                    <span>yuliethanaisc02@gmail.com</span>
                  </a>
                  <a className="contact-link" href="https://instagram.com/its.yulieth_anais02" target="_blank" rel="noreferrer">
                    <InstagramIcon />
                    <span>@its.yulieth_anais02</span>
                  </a>
                </div>

                <div className="card subtle">
                  <p className="card-title">Cierre</p>
                  <p className="muted">
                    Gracias por tomarte el tiempo de visitar mi portafolio. Cada
                    detalle refleja mi pasión por la belleza, el maquillaje y la
                    creatividad.
                  </p>
                  <p className="muted">
                    Este es solo el comienzo.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p className="footer-note">Este es solo el comienzo.</p>
          <div className="footer-links">
            <a href="https://instagram.com/its.yulieth_anais02" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="mailto:yuliethanaisc02@gmail.com">Email</a>
            <a href="https://wa.me/50763721082" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {lightbox ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <button
            type="button"
            className="lightbox-scrim"
            aria-label="Cerrar vista ampliada"
            onClick={() => setLightbox(null)}
          />
          <div className="lightbox-panel">
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Cerrar"
            >
              <CloseIcon />
            </button>
            <div className="lightbox-img-wrap">
              <img
                className="lightbox-img"
                src={lightbox.src}
                alt={lightbox.title}
              />
            </div>
            <div className="lightbox-meta">
              <h3 id="lightbox-title" className="lightbox-title">
                {lightbox.title}
              </h3>
              <p className="lightbox-note">{lightbox.note}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FigureCard(props: {
  title: string
  src: string
  note: string
  onOpen: () => void
}) {
  return (
    <figure className="work work--thumb reveal">
      <button
        type="button"
        className="work-thumb-btn"
        onClick={props.onOpen}
        aria-label={`Ampliar: ${props.title}`}
      >
        <ArtworkFrame
          variant="thumb"
          src={props.src}
          alt={props.title}
          label={props.title}
        />
      </button>
      <figcaption className="work-caption work-caption--compact">
        <div className="work-meta">
          <p className="work-title">{props.title}</p>
          <p className="work-note">{props.note}</p>
        </div>
      </figcaption>
    </figure>
  )
}

function ArtworkFrame(props: {
  src: string
  alt: string
  label: string
  variant?: 'default' | 'thumb'
}) {
  return (
    <div
      className={props.variant === 'thumb' ? 'frame frame--thumb' : 'frame'}
      data-label={props.label}
    >
      <img
        className="frame-img"
        src={props.src}
        alt={props.alt}
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget
          img.onerror = null
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(placeholderSvg(props.label))
        }}
      />
      <div className="frame-overlay" aria-hidden="true" />
    </div>
  )
}

function placeholderSvg(label: string) {
  const safe = label.replace(/</g, '').replace(/>/g, '')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#09070c"/>
      <stop offset="0.55" stop-color="#120914"/>
      <stop offset="1" stop-color="#0a0810"/>
    </linearGradient>
    <linearGradient id="n" x1="0" x2="1" y1="1" y2="0">
      <stop offset="0" stop-color="#ff3ea5" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#f6b7d2" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <circle cx="260" cy="240" r="190" fill="url(#n)" filter="url(#blur)" opacity="0.55"/>
  <circle cx="980" cy="660" r="240" fill="url(#n)" filter="url(#blur)" opacity="0.42"/>
  <path d="M80 770 C 280 650, 430 860, 620 740 S 960 720, 1120 780" fill="none" stroke="#ff3ea5" stroke-opacity="0.18" stroke-width="6"/>
  <path d="M110 165 C 280 120, 360 210, 520 170 S 820 140, 1090 200" fill="none" stroke="#f6b7d2" stroke-opacity="0.12" stroke-width="4"/>
  <g fill="none" stroke="#ff3ea5" stroke-opacity="0.35" stroke-width="3">
    <path d="M930 250 c 20 -50 80 -60 110 -20 c 30 40 0 95 -50 135 c -30 25 -55 40 -55 40 s -25 -15 -55 -40 c -50 -40 -80 -95 -50 -135 c 30 -40 90 -30 105 20"/>
  </g>
  <text x="76" y="92" fill="#f7edf3" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="22" opacity="0.7">Imagen pendiente</text>
  <text x="76" y="138" fill="#ffffff" font-family="ui-serif, Georgia, Times New Roman, Times" font-size="44" letter-spacing="-0.8" opacity="0.92">${safe}</text>
</svg>`
}

function InkStroke() {
  return (
    <svg viewBox="0 0 64 64" width="20" height="20" role="presentation" aria-hidden="true">
      <path
        d="M10 38c10-18 18-18 26-8s14 12 18 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 48c18-10 28-9 40-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}

function GridGlow() {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      style={{ color: 'var(--hero-grid-stroke)' }}
    >
      <defs>
        <radialGradient id="rg" cx="30%" cy="30%" r="60%">
          <stop offset="0" stopColor="var(--neon)" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="var(--pastel)" stopOpacity="0.12" />
          <stop offset="1" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1200" height="700" fill="url(#p)" />
      <rect width="1200" height="700" fill="url(#rg)" />
    </svg>
  )
}

function IconBase(props: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" role="presentation" aria-hidden="true">
      {props.children}
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" role="presentation" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" role="presentation" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" role="presentation" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <IconBase>
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 8.2a3.8 3.8 0 1 0 0 7.6a3.8 3.8 0 0 0 0-7.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M17.6 6.4h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </IconBase>
  )
}

function MailIcon() {
  return (
    <IconBase>
      <path
        d="M4.5 7.5h15v9h-15z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 8l6.8 5.2L18.8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

function WhatsAppIcon() {
  return (
    <IconBase>
      <path
        d="M12 21.2c4.97 0 9-3.86 9-8.62S16.97 4 12 4s-9 3.86-9 8.58c0 1.52.44 2.94 1.2 4.18L3 21l4.43-1.17c1.3.86 2.86 1.37 4.57 1.37Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.1c.2-.4.5-.5.9-.4l.6.2c.3.1.5.3.6.6c.1.4.2.9.4 1.2c.1.2.1.4 0 .6l-.3.5c-.1.2-.1.4.1.6c.7.9 1.6 1.6 2.7 2.1c.2.1.4.1.6 0l.7-.3c.2-.1.4-.1.6 0c.4.2.9.4 1.3.5c.3.1.5.3.6.6l.1.6c.1.4 0 .7-.4.9c-.5.3-1.2.5-1.9.4c-1.6-.2-3.1-1-4.4-2.2c-1.2-1.1-2.1-2.6-2.3-4.1c-.1-.7.1-1.3.4-1.8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </IconBase>
  )
}

function OrnaBase(props: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 120 120"
      width="120"
      height="120"
      role="presentation"
      aria-hidden="true"
    >
      {props.children}
    </svg>
  )
}

function Lipstick() {
  return (
    <OrnaBase className="orna orna-a">
      <path
        d="M56 18h14v18l-6 8H62l-6-8V18Z"
        fill="none"
        stroke="var(--pastel)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M46 44h34v50a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8V44Z"
        fill="none"
        stroke="var(--neon)"
        strokeOpacity="0.9"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M50 62h26"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </OrnaBase>
  )
}

function Brush() {
  return (
    <OrnaBase className="orna orna-b">
      <path
        d="M78 22c6 8 7 14 2 20c-6 7-16 6-24-2c-7-7-10-17-2-24c6-6 16-2 24 6Z"
        fill="none"
        stroke="var(--pastel)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M50 44l32 32"
        fill="none"
        stroke="var(--neon)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M40 54l20 20"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 96c8-4 16-10 22-16l-8-8c-6 6-12 14-16 22c-1 2 0 4 2 3Z"
        fill="none"
        stroke="var(--pastel)"
        strokeOpacity="0.8"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </OrnaBase>
  )
}

function Compact() {
  return (
    <OrnaBase className="orna orna-c">
      <path
        d="M34 70c0-12 10-22 22-22h8c12 0 22 10 22 22v10c0 12-10 22-22 22h-8c-12 0-22-10-22-22V70Z"
        fill="none"
        stroke="var(--neon)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M42 58c6-10 14-16 26-16c12 0 20 6 26 16"
        fill="none"
        stroke="var(--pastel)"
        strokeOpacity="0.9"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M50 78h20"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </OrnaBase>
  )
}

export default App
