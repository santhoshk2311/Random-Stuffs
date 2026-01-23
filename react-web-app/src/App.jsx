import './App.css'

function App() {
  const features = [
    {
      title: 'Fast setup',
      description:
        'Start with Vite, React, and a clean structure so you can focus on features.',
    },
    {
      title: 'Reusable components',
      description:
        'Build a library of UI blocks you can reuse across every page.',
    },
    {
      title: 'Ready for data',
      description:
        'Swap in APIs, state, and routing without reworking your layout.',
    },
  ]

  const checklist = [
    {
      title: 'Map the user flow',
      detail: 'Outline the pages and actions you want to support.',
    },
    {
      title: 'Build the UI shell',
      detail: 'Create sections, cards, and buttons that match your brand.',
    },
    {
      title: 'Connect services',
      detail: 'Add data sources, forms, and deployment targets.',
    },
  ]

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <div className="brand__mark">R</div>
          <div>
            <p className="brand__name">React Web App</p>
            <p className="brand__meta">Starter kit</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#checklist">Checklist</a>
          <a href="#launch">Launch</a>
        </nav>
        <button className="button button--primary" type="button">
          Start building
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">New in 2026</span>
            <h1>Build a clean React web app in minutes.</h1>
            <p className="hero__summary">
              Use this starter to create layouts, build reusable components, and
              ship faster with a polished foundation.
            </p>
            <div className="hero__actions">
              <button className="button button--primary" type="button">
                Create workspace
              </button>
              <button className="button button--ghost" type="button">
                View guide
              </button>
            </div>
            <div className="hero__meta">
              <div>
                <p className="meta__value">3</p>
                <p className="meta__label">setup steps</p>
              </div>
              <div>
                <p className="meta__value">8</p>
                <p className="meta__label">prebuilt sections</p>
              </div>
              <div>
                <p className="meta__value">1</p>
                <p className="meta__label">deploy command</p>
              </div>
            </div>
          </div>
          <div className="hero__card">
            <div className="card">
              <div className="card__header">
                <div>
                  <p className="card__title">Today&apos;s focus</p>
                  <p className="card__subtitle">Plan your launch in 30 minutes</p>
                </div>
                <span className="badge">Live</span>
              </div>
              <ul className="card__list">
                <li>
                  <span className="dot" />Define your routes and views
                </li>
                <li>
                  <span className="dot" />Design a hero and feature section
                </li>
                <li>
                  <span className="dot" />Connect forms to real data
                </li>
              </ul>
              <div className="card__footer">
                <p className="card__note">Next update in 2 hours</p>
                <button className="button button--light" type="button">
                  Open checklist
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section__header">
            <p className="section__eyebrow">Why this setup</p>
            <h2>Everything you need to ship with confidence.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section checklist" id="checklist">
          <div className="section__header">
            <p className="section__eyebrow">Launch checklist</p>
            <h2>Move from idea to production without rework.</h2>
          </div>
          <ol className="checklist__list">
            {checklist.map((item, index) => (
              <li key={item.title}>
                <span className="checklist__step">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="cta" id="launch">
          <div>
            <h2>Ready to create your React web app?</h2>
            <p>
              Customize the sections, add routes, and deploy when you are
              ready.
            </p>
          </div>
          <div className="cta__actions">
            <button className="button button--primary" type="button">
              Launch project
            </button>
            <button className="button button--ghost" type="button">
              Read the README
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>React Web App Starter. Built with Vite and React.</p>
        <div className="footer__links">
          <a href="#features">Features</a>
          <a href="#checklist">Checklist</a>
          <a href="#launch">Launch</a>
        </div>
      </footer>
    </div>
  )
}

export default App
