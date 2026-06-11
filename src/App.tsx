function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(215,169,68,0.18),transparent_32rem),linear-gradient(135deg,#fbf7ef_0%,#eef5f4_52%,#f8eee6_100%)] text-abacus-ink">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-abacus-wood">
            Schoty abacus
          </p>
          <h1 className="text-5xl font-black leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
            A tactile counting workspace for the browser.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-abacus-muted">
            A focused interface for exploring schoty movement with a warm,
            high-contrast visual system ready for the interactive board.
          </p>
        </div>

        <div className="relative min-h-[24rem] overflow-hidden rounded-lg border border-abacus-rail/15 bg-white/75 p-6 shadow-2xl shadow-abacus-rail/10 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-abacus-red via-abacus-gold to-abacus-rail" />
          <div className="flex items-center justify-between border-b border-abacus-rail/10 pb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-abacus-muted">
                Board theme
              </p>
              <p className="mt-1 text-2xl font-black">Base layout</p>
            </div>
            <div className="flex gap-2" aria-hidden="true">
              <span className="size-3 rounded-full bg-abacus-red" />
              <span className="size-3 rounded-full bg-abacus-gold" />
              <span className="size-3 rounded-full bg-abacus-rail" />
            </div>
          </div>

          <div
            className="mt-8 space-y-6"
            aria-label="Abacus visual theme preview"
          >
            {[
              ['bg-abacus-red', 'w-20'],
              ['bg-abacus-gold', 'w-28'],
              ['bg-abacus-rail', 'w-16'],
              ['bg-abacus-red', 'w-24'],
              ['bg-abacus-gold', 'w-12'],
            ].map(([beadColor, activeWidth], index) => (
              <div key={index} className="relative h-9">
                <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-abacus-rail/25" />
                <div
                  className={`absolute left-8 top-1/2 h-5 ${activeWidth} -translate-y-1/2 rounded-full bg-abacus-rail/80`}
                />
                <div className="absolute inset-y-0 left-8 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, beadIndex) => (
                    <span
                      key={beadIndex}
                      className={`size-9 rounded-full ${beadColor} shadow-md shadow-abacus-rail/15 ring-2 ring-white/70`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
