import { useMemo, useState } from 'react';

import { initialBoardState } from './config/schoty';
import { SchotyBoard } from './components/SchotyBoard';
import { computeBoardValueDetails } from './domain/computeValue';
import { moveBeads, type BeadMoveTarget } from './domain/moveBeads';
import type { WireId } from './domain/types';

const valueFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

function App() {
  const [board, setBoard] = useState(initialBoardState);
  const valueDetails = useMemo(() => computeBoardValueDetails(board), [board]);
  const activeBeadCount = valueDetails.wires.reduce(
    (total, wireValue) => total + wireValue.activeBeadCount,
    0,
  );
  const formattedValue = valueFormatter.format(valueDetails.total);

  const handleMoveBead = (wireId: WireId, target: BeadMoveTarget) => {
    setBoard((currentBoard) => ({
      ...currentBoard,
      wires: currentBoard.wires.map((wire) =>
        wire.id === wireId ? moveBeads(wire, target) : wire,
      ),
    }));
  };

  const handleReset = () => {
    setBoard(initialBoardState);
  };

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
            The frame renders horizontal wires with parked beads on the left and
            active beads snapping to the right.
          </p>

          <div className="mt-8 flex max-w-xl flex-col gap-4 rounded-lg border border-abacus-rail/15 bg-white/70 p-4 shadow-lg shadow-abacus-rail/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-abacus-muted">
                Current value
              </p>
              <output
                className="mt-2 block min-h-12 text-5xl font-black leading-none text-abacus-rail"
                aria-live="polite"
                aria-label={`Current schoty value ${formattedValue}`}
                data-testid="current-value"
              >
                {formattedValue}
              </output>
              <p
                className="mt-2 text-sm font-semibold text-abacus-muted"
                data-testid="active-bead-count"
              >
                {activeBeadCount} active beads
              </p>
            </div>

            <button
              type="button"
              className="min-h-11 rounded-md bg-abacus-rail px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md shadow-abacus-rail/20 transition hover:bg-abacus-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-abacus-rail disabled:cursor-not-allowed disabled:bg-abacus-muted/45 disabled:shadow-none"
              onClick={handleReset}
              disabled={activeBeadCount === 0}
            >
              Reset
            </button>
          </div>
        </div>

        <SchotyBoard board={board} onMoveBead={handleMoveBead} />
      </section>
    </main>
  );
}

export default App;
