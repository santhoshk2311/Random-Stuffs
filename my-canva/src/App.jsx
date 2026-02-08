import './App.css'

function App() {
  return (
    <div className="app">
      <header className="hero">
        <span className="badge">My canva</span>
        <h1>Design ideas, ready when you are</h1>
        <p>
          My canva is your clean, modern starting point for building a visual
          workspace. Customize it with templates, brand colors, and quick
          exports.
        </p>
        <div className="actions">
          <button className="primary">Start a new design</button>
          <button className="secondary">Browse templates</button>
        </div>
      </header>

      <section className="highlights">
        <article>
          <h2>Quick layouts</h2>
          <p>Jump into polished layouts with a single click.</p>
        </article>
        <article>
          <h2>Brand-ready</h2>
          <p>Keep fonts, colors, and logos consistent across every project.</p>
        </article>
        <article>
          <h2>Share fast</h2>
          <p>Export, present, and collaborate without leaving the editor.</p>
        </article>
      </section>
    </div>
  )
}

export default App
