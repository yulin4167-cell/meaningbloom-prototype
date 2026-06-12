import { useState, useEffect } from 'react'
import './App.css'

const NAV_SECTIONS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'principles', label: 'Design Principles' },
  { id: 'colors',     label: 'Color Palette' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing',    label: 'Spacing & Layout' },
  { id: 'components', label: 'Components' },
  { id: 'voice',      label: 'Voice & Tone' },
  { id: 'projects',   label: 'Projects in Use' },
]

export default function App() {
  const [active, setActive] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -75% 0px' }
    )
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-name">Yulin Li</div>
          <div className="sidebar-style">Gentle Systems</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              className={`nav-item${active === id ? ' active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">Style Guide · 2025</div>
      </aside>

      {/* ── Mobile header ── */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <span className="mobile-name">Yulin Li</span>
          <span className="mobile-style">Gentle Systems</span>
        </div>
        <button
          className={`hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* ── Main ── */}
      <main className="main">
        <div className="content-area">

          {/* ── Overview ── */}
          <section id="overview" className="section">
            <div className="hero-eyebrow">Personal Style Guide</div>
            <h1 className="hero-name">Yulin Li</h1>
            <p className="hero-tagline">Gentle Systems</p>
            <p className="hero-desc">
              I am a designer working across interaction design, service design, UX research,
              and digital product experiences. My work explores the spaces where people feel
              vulnerable, overlooked, or underserved — and finds ways to make those moments
              feel safer, warmer, and more human.
            </p>
            <p className="hero-desc">
              Gentle Systems is my design voice. It is a soft, structured, and human-centered
              design language that combines care, emotional safety, service design, interaction
              design, and system thinking. My work is calm, warm, organized, emotionally
              supportive, and deeply rooted in the people it serves.
            </p>
            <div className="overview-tags">
              <span className="tag">Interaction Design</span>
              <span className="tag mist">Service Design</span>
              <span className="tag wheat">UX Research</span>
              <span className="tag outline">Digital Product</span>
            </div>
          </section>

          {/* ── Design Principles ── */}
          <section id="principles" className="section">
            <div className="section-label">Design Principles</div>
            <h2 className="section-title">The values that shape my work</h2>
            <p className="section-body">
              These three principles guide every decision — from the structure of a service
              to the weight of a button label. They are not rules, but orientations.
            </p>
            <div className="principles-grid">
              <div className="principle-card">
                <div className="principle-number">01</div>
                <div className="principle-name">Soft Guidance</div>
                <p className="principle-desc">
                  Direction without pressure. Good design suggests rather than commands.
                  It opens a path and trusts people to walk it at their own pace. Systems
                  should feel like a gentle hand, not a locked gate.
                </p>
              </div>
              <div className="principle-card">
                <div className="principle-number">02</div>
                <div className="principle-name">Emotional Safety</div>
                <p className="principle-desc">
                  People need to feel safe before they can engage honestly. Design that
                  creates emotional safety reduces friction at the deepest level — not
                  just usability friction, but the friction of being seen and trusting
                  that it is okay.
                </p>
              </div>
              <div className="principle-card">
                <div className="principle-number">03</div>
                <div className="principle-name">Human-scale Systems</div>
                <p className="principle-desc">
                  Systems built for people should feel like they were made by people.
                  Structure matters, but it should never overpower the human experience
                  inside it. Scale down; stay close to the individual.
                </p>
              </div>
            </div>
          </section>

          {/* ── Color Palette ── */}
          <section id="colors" className="section">
            <div className="section-label">Color Palette</div>
            <h2 className="section-title">A warm, considered palette</h2>
            <p className="section-body">
              These colors were chosen to feel calm and grounded. Nothing shouts.
              Each color has a role — together they create a quiet harmony.
            </p>
            <div className="color-grid">
              {[
                {
                  name: 'Sage Green',
                  hex: '#8FAF9C',
                  bg: '#8FAF9C',
                  note: 'Primary. Navigation, active states, key interactive elements.',
                },
                {
                  name: 'Warm Cream',
                  hex: '#F7F3EA',
                  bg: '#F7F3EA',
                  note: 'Background. The resting surface for all content.',
                },
                {
                  name: 'Deep Charcoal',
                  hex: '#2F3430',
                  bg: '#2F3430',
                  note: 'Primary text. Headings, body, and primary labels.',
                },
                {
                  name: 'Mist Blue',
                  hex: '#BFD7D9',
                  bg: '#BFD7D9',
                  note: 'Secondary. Highlights, hover states, callout backgrounds.',
                },
                {
                  name: 'Soft Wheat',
                  hex: '#E8C970',
                  bg: '#E8C970',
                  note: 'Accent. Warmth, emphasis, and celebratory moments.',
                },
                {
                  name: 'Gentle Gray',
                  hex: '#D8D8D2',
                  bg: '#D8D8D2',
                  note: 'Border & dividers. Subtle structure without weight.',
                },
              ].map((color) => (
                <div className="color-swatch" key={color.hex}>
                  <div className="swatch-color" style={{ background: color.bg }} />
                  <div className="swatch-info">
                    <div className="swatch-name">{color.name}</div>
                    <div className="swatch-hex">{color.hex}</div>
                    <div className="swatch-note">{color.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Typography ── */}
          <section id="typography" className="section">
            <div className="section-label">Typography</div>
            <h2 className="section-title">Type with warmth and clarity</h2>
            <p className="section-body">
              DM Serif Display brings a literary, human quality to headings. Inter
              handles all body and UI text — legible, neutral, and quietly functional.
              Together they balance warmth with structure.
            </p>
            <div className="type-scale">
              <div className="type-row">
                <div className="type-meta">
                  <span className="type-meta-label">H1</span>
                  <span className="type-meta-size">56px / 64px</span>
                </div>
                <div className="type-sample t-h1">Gentle Systems</div>
              </div>
              <div className="type-row">
                <div className="type-meta">
                  <span className="type-meta-label">H2</span>
                  <span className="type-meta-size">36px / 44px</span>
                </div>
                <div className="type-sample t-h2">Care in every detail</div>
              </div>
              <div className="type-row">
                <div className="type-meta">
                  <span className="type-meta-label">H3</span>
                  <span className="type-meta-size">22px / 30px</span>
                </div>
                <div className="type-sample t-h3">Soft Guidance</div>
              </div>
              <div className="type-row">
                <div className="type-meta">
                  <span className="type-meta-label">Body</span>
                  <span className="type-meta-size">16px / 26px</span>
                </div>
                <div className="type-sample t-body">
                  Design that creates emotional safety reduces friction at the deepest
                  level — not just usability friction, but the friction of being seen.
                </div>
              </div>
              <div className="type-row">
                <div className="type-meta">
                  <span className="type-meta-label">Caption</span>
                  <span className="type-meta-size">13px / 20px</span>
                </div>
                <div className="type-sample t-caption">
                  Service Design · Interaction Design · UX Research
                </div>
              </div>
            </div>
          </section>

          {/* ── Spacing & Layout ── */}
          <section id="spacing" className="section">
            <div className="section-label">Spacing & Layout</div>
            <h2 className="section-title">Room to breathe, room to think</h2>
            <p className="section-body">
              Generous space is not empty space. It is space that allows content to
              land, and people to feel unhurried.
            </p>
            <div className="spacing-grid">
              <div className="spacing-card">
                <div className="spacing-card-title">Breathing Space</div>
                <p className="spacing-card-desc">
                  Margins and padding are intentionally generous. Each element needs
                  air around it so it can exist without competing. Crowding creates
                  anxiety — space creates calm.
                </p>
                <div className="spacing-visual" />
              </div>
              <div className="spacing-card">
                <div className="spacing-card-title">Soft Structure</div>
                <p className="spacing-card-desc">
                  Layouts are organized but not rigid. Grid systems provide invisible
                  scaffolding without imposing hard rules. Structure supports without
                  confining.
                </p>
                <div className="spacing-visual structure" />
              </div>
              <div className="spacing-card">
                <div className="spacing-card-title">Clear Rhythm</div>
                <p className="spacing-card-desc">
                  Consistent vertical rhythm — spacing between headings, paragraphs,
                  and sections — creates a sense of predictability and ease. Readers
                  find their way without thinking.
                </p>
                <div className="spacing-visual rhythm" />
              </div>
              <div className="spacing-card">
                <div className="spacing-card-title">Human Pace</div>
                <p className="spacing-card-desc">
                  Nothing happens too fast. Transitions are measured in moments, not
                  milliseconds. The system moves at a pace that feels considered,
                  not reactive.
                </p>
                <div className="spacing-visual" style={{ background: 'var(--wheat-light)', borderColor: 'rgba(232,201,112,0.3)' }} />
              </div>
            </div>
          </section>

          {/* ── Components ── */}
          <section id="components" className="section">
            <div className="section-label">Components</div>
            <h2 className="section-title">Building blocks of the system</h2>
            <p className="section-body">
              These core components recur across projects. Each one is designed to
              feel approachable, readable, and calm.
            </p>

            {/* Soft Project Card */}
            <div className="component-block">
              <div className="component-label">Soft Project Card</div>
              <div className="component-demo">
                <div className="project-card-demo">
                  <div className="project-card-thumb">
                    <div className="project-card-thumb-inner">🌿</div>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-tags">
                      <span className="tag">Service Design</span>
                      <span className="tag mist">Research</span>
                    </div>
                    <div className="project-card-title">Kindred Care</div>
                    <p className="project-card-desc">
                      A service design project about community support, soft safety
                      systems, and helping older adults feel connected and safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gentle Tag System */}
            <div className="component-block">
              <div className="component-label">Gentle Tag System</div>
              <div className="component-demo">
                <div className="tag-system-demo">
                  <div>
                    <div className="tag-group-label">Primary — Sage</div>
                    <div className="tag-row">
                      <span className="tag">Service Design</span>
                      <span className="tag">Interaction Design</span>
                      <span className="tag">Care</span>
                    </div>
                  </div>
                  <div>
                    <div className="tag-group-label">Secondary — Mist</div>
                    <div className="tag-row">
                      <span className="tag mist">UX Research</span>
                      <span className="tag mist">Community</span>
                      <span className="tag mist">Systems</span>
                    </div>
                  </div>
                  <div>
                    <div className="tag-group-label">Accent — Wheat</div>
                    <div className="tag-row">
                      <span className="tag wheat">Featured</span>
                      <span className="tag wheat">New</span>
                    </div>
                  </div>
                  <div>
                    <div className="tag-group-label">Neutral — Outline</div>
                    <div className="tag-row">
                      <span className="tag outline">2024</span>
                      <span className="tag outline">Academic</span>
                      <span className="tag outline">Ongoing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Block */}
            <div className="component-block">
              <div className="component-label">Insight Block</div>
              <div className="component-demo" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="insight-block">
                  <div className="insight-label">Key Insight</div>
                  <p className="insight-text">
                    "Older adults don't want to be monitored — they want to feel
                    trusted. Safety and autonomy are not opposites."
                  </p>
                </div>
                <div className="insight-block mist">
                  <div className="insight-label">Research Finding</div>
                  <p className="insight-text">
                    "The most meaningful moments of emotional support happened
                    not in designed features, but in the quiet space between them."
                  </p>
                </div>
                <div className="insight-block wheat">
                  <div className="insight-label">Design Opportunity</div>
                  <p className="insight-text">
                    "A gentle check-in, delivered at the right moment, can carry
                    more weight than a fully featured dashboard."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Voice & Tone ── */}
          <section id="voice" className="section">
            <div className="section-label">Voice & Tone</div>
            <h2 className="section-title">How I write and speak</h2>
            <p className="voice-desc">
              My writing voice is calm, observant, reflective, warm, clear, and
              human-centered. I write from the perspective of someone who notices —
              who pays attention to small things and believes they matter.
            </p>

            <div className="word-cloud">
              {[
                'care', 'support', 'guide', 'notice', 'connection', 'trust',
                'rhythm', 'presence', 'emotional safety', 'gentle interaction',
                'shared responsibility', 'warmth', 'attention', 'belonging',
              ].map((word) => (
                <span key={word} className="tag">{word}</span>
              ))}
            </div>

            <div className="voice-grid">
              <div className="voice-card">
                <div className="voice-card-label use">I write with</div>
                <ul>
                  <li>Calm, unhurried sentences</li>
                  <li>Specific, observed details</li>
                  <li>Warmth without sentimentality</li>
                  <li>Clarity without coldness</li>
                  <li>Questions that open thinking</li>
                  <li>Honest, grounded language</li>
                </ul>
              </div>
              <div className="voice-card avoid-card">
                <div className="voice-card-label avoid">I avoid</div>
                <ul>
                  <li>Aggressive marketing language</li>
                  <li>Cold system language</li>
                  <li>Overly technical explanations</li>
                  <li>Generic AI-sounding phrases</li>
                  <li>Hype, urgency, or pressure</li>
                  <li>Jargon without warmth</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── Projects in Use ── */}
          <section id="projects" className="section">
            <div className="section-label">Projects in Use</div>
            <h2 className="section-title">The system at work</h2>
            <p className="section-body">
              These two projects show how Gentle Systems principles come to life
              across different design contexts — one in service design, one in
              emotional interaction design.
            </p>

            <div className="projects-grid">
              {/* Kindred Care */}
              <div className="project-full-card">
                <div className="project-banner kindred">
                  <div className="project-banner-icon">🌿</div>
                </div>
                <div className="project-content">
                  <div className="project-tags">
                    <span className="tag">Service Design</span>
                    <span className="tag mist">Elderly Care</span>
                    <span className="tag outline">2024</span>
                  </div>
                  <div className="project-title">Kindred Care</div>
                  <p className="project-summary">
                    A service design project exploring how community support systems
                    can help older adults feel connected, trusted, and safe — without
                    making them feel monitored or controlled. The project maps soft
                    safety networks, trust-building rituals, and the design of moments
                    that preserve dignity and autonomy.
                  </p>
                  <div className="project-principles">
                    <div className="project-principle">
                      <div className="project-principle-dot" />
                      Soft Guidance — support structures that suggest, never prescribe
                    </div>
                    <div className="project-principle">
                      <div className="project-principle-dot" />
                      Emotional Safety — designing for trust, not surveillance
                    </div>
                    <div className="project-principle">
                      <div className="project-principle-dot" />
                      Human-scale Systems — community as the unit of care
                    </div>
                  </div>
                </div>
              </div>

              {/* MoMo */}
              <div className="project-full-card">
                <div className="project-banner momo">
                  <div className="project-banner-icon">🌙</div>
                </div>
                <div className="project-content">
                  <div className="project-tags">
                    <span className="tag">Interaction Design</span>
                    <span className="tag wheat">Companion</span>
                    <span className="tag outline">2024</span>
                  </div>
                  <div className="project-title">MoMo</div>
                  <p className="project-summary">
                    An emotional interaction and companion product designed for daily
                    companionship, lightweight emotional check-ins, and gentle digital
                    presence. MoMo explores how a device can hold space for someone —
                    not by doing too much, but by being quietly, reliably there.
                  </p>
                  <div className="project-principles">
                    <div className="project-principle">
                      <div className="project-principle-dot mist-dot" />
                      Soft Guidance — low-friction prompts that respect emotional pace
                    </div>
                    <div className="project-principle">
                      <div className="project-principle-dot mist-dot" />
                      Emotional Safety — interactions that never demand or judge
                    </div>
                    <div className="project-principle">
                      <div className="project-principle-dot mist-dot" />
                      Human-scale Systems — a companion that feels personal, not clinical
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
