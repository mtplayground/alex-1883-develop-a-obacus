export type BeadSide = 'parked' | 'active';

export type WireKind = 'standard' | 'quarter';

export type WireId = `wire-${number}` | 'quarter-wire';

export type BeadId = `${WireId}-bead-${number}`;

export interface BeadState {
  readonly id: BeadId;
  readonly wireId: WireId;
  readonly index: number;
  readonly side: BeadSide;
}

export interface WireConfig {
  readonly id: WireId;
  readonly index: number;
  readonly kind: WireKind;
  readonly beadCount: number;
}

export interface WireState {
  readonly id: WireId;
  readonly index: number;
  readonly kind: WireKind;
  readonly beads: readonly BeadState[];
}

export interface QuarterWireConfig {
  readonly enabled: boolean;
  readonly beadCount: 4;
}

export interface SchotyConfig {
  readonly wireCount: number;
  readonly beadsPerWire: 10;
  readonly quarterWire: QuarterWireConfig;
  readonly wires: readonly WireConfig[];
}

export interface BoardState {
  readonly config: SchotyConfig;
  readonly wires: readonly WireState[];
}
