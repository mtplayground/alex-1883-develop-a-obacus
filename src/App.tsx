import { initialBoardState } from './config/schoty';
import { SchotyBoard } from './components/SchotyBoard';
import { setWireActiveCount } from './domain/moveBeads';

const boardPreviewState = {
  ...initialBoardState,
  wires: initialBoardState.wires.map((wire) =>
    setWireActiveCount(
      wire,
      Math.min(wire.beads.length - 1, wire.kind === 'quarter' ? 1 : 3),
    ),
  ),
};

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(215,169,68,0.18),transparent_32rem),linear-gradient(135deg,#fbf7ef_0%,#eef5f4_52%,#f8eee6_100%)] text-abacus-ink">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-abacus-wood">
            Schoty abacus
          </p>
          <h1 className="text-4xl font-black leading-tight text-balance sm:text-5xl lg:text-6xl">
            A working board surface for bead movement.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-abacus-muted">
            The frame now renders horizontal wires with parked beads on the left
            and active beads on the right, ready for pointer interaction.
          </p>
        </div>

        <SchotyBoard board={boardPreviewState} />
      </section>
    </main>
  );
}

export default App;
