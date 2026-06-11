import { useState } from 'react';

import { initialBoardState } from './config/schoty';
import { SchotyBoard } from './components/SchotyBoard';
import { moveBeads, type BeadMoveTarget } from './domain/moveBeads';
import type { WireId } from './domain/types';

function App() {
  const [board, setBoard] = useState(initialBoardState);

  const handleMoveBead = (wireId: WireId, target: BeadMoveTarget) => {
    setBoard((currentBoard) => ({
      ...currentBoard,
      wires: currentBoard.wires.map((wire) =>
        wire.id === wireId ? moveBeads(wire, target) : wire,
      ),
    }));
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
        </div>

        <SchotyBoard board={board} onMoveBead={handleMoveBead} />
      </section>
    </main>
  );
}

export default App;
