import type { BeadState, BoardState, WireState } from '../domain/types';

interface SchotyBoardProps {
  readonly board: BoardState;
}

interface WireProps {
  readonly wire: WireState;
}

interface BeadProps {
  readonly bead: BeadState;
}

const boardLabel = (wire: WireState) =>
  wire.kind === 'quarter'
    ? 'Quarter wire'
    : `Wire ${wire.index + 1}, ${wire.beads.length} beads`;

const Bead = ({ bead }: BeadProps) => (
  <span
    className={[
      'block size-5 rounded-full shadow-sm ring-1 ring-white/80',
      'sm:size-6 md:size-7 lg:size-8',
      bead.side === 'active'
        ? 'bg-abacus-red shadow-abacus-red/20'
        : 'bg-abacus-gold shadow-abacus-rail/15',
    ].join(' ')}
    aria-label={`Bead ${bead.index + 1} ${bead.side}`}
  />
);

const Wire = ({ wire }: WireProps) => {
  const parkedBeads = wire.beads.filter((bead) => bead.side === 'parked');
  const activeBeads = wire.beads.filter((bead) => bead.side === 'active');

  return (
    <div
      className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[5.25rem_1fr] sm:gap-4"
      aria-label={boardLabel(wire)}
    >
      <div className="text-right text-xs font-bold uppercase tracking-[0.12em] text-abacus-muted">
        {wire.kind === 'quarter' ? '1/4' : `10^${wire.index}`}
      </div>

      <div className="relative min-h-10 sm:min-h-12">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-abacus-rail shadow-inner shadow-abacus-ink/20" />
        <div className="relative z-10 flex min-h-10 items-center justify-between gap-3 sm:min-h-12">
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            {parkedBeads.map((bead) => (
              <Bead key={bead.id} bead={bead} />
            ))}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-1">
            {activeBeads.map((bead) => (
              <Bead key={bead.id} bead={bead} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SchotyBoard = ({ board }: SchotyBoardProps) => (
  <section
    className="w-full rounded-lg border-[10px] border-abacus-wood bg-[linear-gradient(90deg,rgba(251,247,239,0.94),rgba(238,245,244,0.9))] p-3 shadow-2xl shadow-abacus-rail/15 sm:border-[14px] sm:p-5"
    aria-label={`Schoty board with ${board.wires.length} wires`}
  >
    <div className="rounded-sm border border-abacus-wood/30 bg-white/55 px-2 py-4 sm:px-4 sm:py-5">
      <div className="space-y-3 sm:space-y-4">
        {board.wires.map((wire) => (
          <Wire key={wire.id} wire={wire} />
        ))}
      </div>
    </div>
  </section>
);
