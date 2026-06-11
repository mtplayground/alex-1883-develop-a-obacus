import { useRef, useState, type PointerEvent } from 'react';

import type { BeadMoveTarget } from '../domain/moveBeads';
import type { BeadState, BoardState, WireState } from '../domain/types';
import type { BeadId, WireId } from '../domain/types';

interface SchotyBoardProps {
  readonly board: BoardState;
  readonly onMoveBead: (wireId: WireId, target: BeadMoveTarget) => void;
}

interface WireProps {
  readonly wire: WireState;
  readonly onMoveBead: (wireId: WireId, target: BeadMoveTarget) => void;
}

interface BeadProps {
  readonly bead: BeadState;
  readonly isDragging: boolean;
  readonly onPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => void;
  readonly onPointerUp: (
    event: PointerEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => void;
  readonly onPointerCancel: () => void;
  readonly onKeyDown: (
    event: React.KeyboardEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => void;
}

interface DragState {
  readonly bead: BeadState;
  readonly startX: number;
  readonly startY: number;
}

const TAP_DISTANCE_PX = 8;

const boardLabel = (wire: WireState) =>
  wire.kind === 'quarter'
    ? 'Quarter wire'
    : `Wire ${wire.index + 1}, ${wire.beads.length} beads`;

const getDragDistance = (event: PointerEvent, drag: DragState) =>
  Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);

const shouldMoveFromDrag = (event: PointerEvent, drag: DragState) => {
  const distance = getDragDistance(event, drag);

  if (distance <= TAP_DISTANCE_PX) {
    return true;
  }

  const horizontalDelta = event.clientX - drag.startX;

  return drag.bead.side === 'parked'
    ? horizontalDelta > TAP_DISTANCE_PX
    : horizontalDelta < -TAP_DISTANCE_PX;
};

const Bead = ({
  bead,
  isDragging,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
}: BeadProps) => (
  <button
    type="button"
    className={[
      'block size-5 touch-none rounded-full shadow-sm ring-1 ring-white/80 transition duration-150',
      'cursor-grab active:cursor-grabbing',
      'sm:size-6 md:size-7 lg:size-8',
      bead.side === 'active'
        ? 'bg-abacus-red shadow-abacus-red/20'
        : 'bg-abacus-gold shadow-abacus-rail/15',
      isDragging
        ? 'scale-110 ring-2 ring-abacus-ink/35'
        : 'hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-abacus-rail',
    ].join(' ')}
    onPointerDown={(event) => onPointerDown(event, bead)}
    onPointerUp={(event) => onPointerUp(event, bead)}
    onPointerCancel={onPointerCancel}
    onLostPointerCapture={onPointerCancel}
    onKeyDown={(event) => onKeyDown(event, bead)}
    aria-label={`Bead ${bead.index + 1} ${bead.side}`}
  />
);

const Wire = ({ wire, onMoveBead }: WireProps) => {
  const dragRef = useRef<DragState | null>(null);
  const [draggingBeadId, setDraggingBeadId] = useState<BeadId | null>(null);
  const parkedBeads = wire.beads.filter((bead) => bead.side === 'parked');
  const activeBeads = wire.beads.filter((bead) => bead.side === 'active');

  const clearDrag = () => {
    dragRef.current = null;
    setDraggingBeadId(null);
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      bead,
      startX: event.clientX,
      startY: event.clientY,
    };
    setDraggingBeadId(bead.id);
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => {
    const drag = dragRef.current;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    clearDrag();

    if (!drag || drag.bead.id !== bead.id) {
      return;
    }

    if (shouldMoveFromDrag(event, drag)) {
      onMoveBead(wire.id, bead);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    bead: BeadState,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onMoveBead(wire.id, bead);
  };

  return (
    <div
      role="group"
      className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[5.25rem_1fr] sm:gap-4"
      aria-label={boardLabel(wire)}
      data-testid={wire.id}
    >
      <div className="text-right text-xs font-bold uppercase tracking-[0.12em] text-abacus-muted">
        {wire.kind === 'quarter' ? '1/4' : `10^${wire.index}`}
      </div>

      <div className="relative min-h-10 sm:min-h-12">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-abacus-rail shadow-inner shadow-abacus-ink/20" />
        <div className="relative z-10 flex min-h-10 items-center justify-between gap-3 sm:min-h-12">
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            {parkedBeads.map((bead) => (
              <Bead
                key={bead.id}
                bead={bead}
                isDragging={draggingBeadId === bead.id}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={clearDrag}
                onKeyDown={handleKeyDown}
              />
            ))}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-1">
            {activeBeads.map((bead) => (
              <Bead
                key={bead.id}
                bead={bead}
                isDragging={draggingBeadId === bead.id}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={clearDrag}
                onKeyDown={handleKeyDown}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SchotyBoard = ({ board, onMoveBead }: SchotyBoardProps) => (
  <section
    className="w-full rounded-lg border-[10px] border-abacus-wood bg-[linear-gradient(90deg,rgba(251,247,239,0.94),rgba(238,245,244,0.9))] p-3 shadow-2xl shadow-abacus-rail/15 sm:border-[14px] sm:p-5"
    aria-label={`Schoty board with ${board.wires.length} wires`}
  >
    <div className="rounded-sm border border-abacus-wood/30 bg-white/55 px-2 py-4 sm:px-4 sm:py-5">
      <div className="space-y-3 sm:space-y-4">
        {board.wires.map((wire) => (
          <Wire key={wire.id} wire={wire} onMoveBead={onMoveBead} />
        ))}
      </div>
    </div>
  </section>
);
