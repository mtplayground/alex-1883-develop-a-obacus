import { getActiveBeadCount } from './moveBeads';
import type { BoardState, WireId, WireKind, WireState } from './types';

export const QUARTER_WIRE_PLACE_VALUE = 0.25;

export interface WireValue {
  readonly id: WireId;
  readonly kind: WireKind;
  readonly activeBeadCount: number;
  readonly placeValue: number;
  readonly value: number;
}

export interface BoardValue {
  readonly total: number;
  readonly wires: readonly WireValue[];
}

export const getStandardWirePlaceValue = (standardWireIndex: number) => {
  if (!Number.isInteger(standardWireIndex) || standardWireIndex < 0) {
    throw new RangeError('Standard wire index must be a non-negative integer.');
  }

  return 10 ** standardWireIndex;
};

export const computeWireValue = (
  wire: WireState,
  standardWireIndex = wire.index,
): WireValue => {
  const activeBeadCount = getActiveBeadCount(wire);
  const placeValue =
    wire.kind === 'quarter'
      ? QUARTER_WIRE_PLACE_VALUE
      : getStandardWirePlaceValue(standardWireIndex);

  return {
    id: wire.id,
    kind: wire.kind,
    activeBeadCount,
    placeValue,
    value: activeBeadCount * placeValue,
  };
};

export const computeWiresValue = (wires: readonly WireState[]): BoardValue => {
  let standardWireIndex = 0;

  const wireValues = wires.map((wire) => {
    if (wire.kind === 'quarter') {
      return computeWireValue(wire);
    }

    const wireValue = computeWireValue(wire, standardWireIndex);
    standardWireIndex += 1;
    return wireValue;
  });

  return {
    total: wireValues.reduce((sum, wireValue) => sum + wireValue.value, 0),
    wires: wireValues,
  };
};

export const computeBoardValueDetails = (board: BoardState): BoardValue =>
  computeWiresValue(board.wires);

export const computeBoardValue = (board: BoardState) =>
  computeBoardValueDetails(board).total;
