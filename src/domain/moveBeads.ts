import type { BeadId, BeadState, WireState } from './types';

export type BeadMoveTarget = BeadId | BeadState | number;

export const getActiveBeadCount = (wire: WireState) =>
  wire.beads.filter((bead) => bead.side === 'active').length;

export const setWireActiveCount = (
  wire: WireState,
  activeCount: number,
): WireState => {
  if (!Number.isInteger(activeCount)) {
    throw new TypeError('Active bead count must be an integer.');
  }

  if (activeCount < 0 || activeCount > wire.beads.length) {
    throw new RangeError(
      `Active bead count must be between 0 and ${wire.beads.length}.`,
    );
  }

  const activeStartIndex = wire.beads.length - activeCount;

  return {
    ...wire,
    beads: wire.beads.map((bead) => ({
      ...bead,
      side: bead.index >= activeStartIndex ? 'active' : 'parked',
    })),
  };
};

const resolveTargetBead = (
  wire: WireState,
  target: BeadMoveTarget,
): BeadState => {
  if (typeof target === 'number') {
    if (!Number.isInteger(target)) {
      throw new TypeError('Target bead index must be an integer.');
    }

    const bead = wire.beads.find((candidate) => candidate.index === target);

    if (!bead) {
      throw new RangeError(`No bead exists at index ${target}.`);
    }

    return bead;
  }

  if (typeof target === 'string') {
    const bead = wire.beads.find((candidate) => candidate.id === target);

    if (!bead) {
      throw new RangeError(`No bead exists with id ${target}.`);
    }

    return bead;
  }

  if (target.wireId !== wire.id) {
    throw new RangeError(
      `Target bead ${target.id} belongs to ${target.wireId}, not ${wire.id}.`,
    );
  }

  const bead = wire.beads.find((candidate) => candidate.id === target.id);

  if (!bead) {
    throw new RangeError(`No bead exists with id ${target.id}.`);
  }

  return bead;
};

export const moveBeads = (
  wire: WireState,
  target: BeadMoveTarget,
): WireState => {
  const targetBead = resolveTargetBead(wire, target);
  const nextActiveCount =
    targetBead.side === 'parked'
      ? wire.beads.length - targetBead.index
      : wire.beads.length - targetBead.index - 1;

  return setWireActiveCount(wire, nextActiveCount);
};
