import { describe, expect, it } from 'vitest';

import { createInitialBoardState, createSchotyConfig } from '../config/schoty';
import { computeBoardValue, computeBoardValueDetails } from './computeValue';
import { getActiveBeadCount, moveBeads, setWireActiveCount } from './moveBeads';
import type { BoardState, WireState } from './types';

const createBoard = (wireCount = 3, enableQuarterWire = false): BoardState =>
  createInitialBoardState(createSchotyConfig({ wireCount, enableQuarterWire }));

const activeIndexes = (wire: WireState) =>
  wire.beads.filter((bead) => bead.side === 'active').map((bead) => bead.index);

describe('moveBeads', () => {
  it('moves a parked target bead and all beads through the active side', () => {
    const board = createBoard();
    const wire = board.wires[0];

    const movedWire = moveBeads(wire, 7);

    expect(getActiveBeadCount(movedWire)).toBe(3);
    expect(activeIndexes(movedWire)).toEqual([7, 8, 9]);
    expect(getActiveBeadCount(wire)).toBe(0);
  });

  it('moves an active target bead and active-side beads back to parked', () => {
    const board = createBoard();
    const wire = setWireActiveCount(board.wires[0], 4);

    const movedWire = moveBeads(wire, 8);

    expect(getActiveBeadCount(movedWire)).toBe(1);
    expect(activeIndexes(movedWire)).toEqual([9]);
  });

  it('rejects a target bead from a different wire', () => {
    const board = createBoard();
    const wire = board.wires[0];
    const beadOnDifferentWire = board.wires[1].beads[0];

    expect(() => moveBeads(wire, beadOnDifferentWire)).toThrow(RangeError);
  });
});

describe('computeBoardValue', () => {
  it('computes standard wires as decimal place values', () => {
    const board = createBoard();
    const valuedBoard: BoardState = {
      ...board,
      wires: [
        setWireActiveCount(board.wires[0], 5),
        setWireActiveCount(board.wires[1], 2),
        setWireActiveCount(board.wires[2], 1),
      ],
    };

    expect(computeBoardValue(valuedBoard)).toBe(125);
  });

  it('includes the optional quarter wire as quarter units', () => {
    const board = createBoard(3, true);
    const valuedBoard: BoardState = {
      ...board,
      wires: [
        setWireActiveCount(board.wires[0], 5),
        setWireActiveCount(board.wires[1], 2),
        setWireActiveCount(board.wires[2], 1),
        setWireActiveCount(board.wires[3], 3),
      ],
    };

    const valueDetails = computeBoardValueDetails(valuedBoard);

    expect(valueDetails.total).toBe(125.75);
    expect(valueDetails.wires[3]).toMatchObject({
      activeBeadCount: 3,
      placeValue: 0.25,
      value: 0.75,
    });
  });
});
