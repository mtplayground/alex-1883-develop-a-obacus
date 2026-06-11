import type {
  BeadId,
  BoardState,
  SchotyConfig,
  WireConfig,
  WireId,
  WireState,
} from '../domain/types';

export const DEFAULT_WIRE_COUNT = 10;
export const BEADS_PER_WIRE = 10;
export const QUARTER_WIRE_BEAD_COUNT = 4;

const parsePositiveInteger = (
  rawValue: string | undefined,
  fallback: number,
  label: string,
) => {
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1) {
    console.warn(`${label} must be a positive integer. Using ${fallback}.`);
    return fallback;
  }

  return parsed;
};

const parseBoolean = (rawValue: string | undefined) => {
  if (!rawValue) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(rawValue.toLowerCase());
};

export const createWireId = (index: number): WireId => `wire-${index}`;

export const createBeadId = (wireId: WireId, index: number): BeadId =>
  `${wireId}-bead-${index}`;

export const createSchotyConfig = (
  overrides: Partial<Pick<SchotyConfig, 'wireCount'>> & {
    readonly enableQuarterWire?: boolean;
  } = {},
): SchotyConfig => {
  const wireCount = overrides.wireCount ?? DEFAULT_WIRE_COUNT;
  const quarterWireEnabled = overrides.enableQuarterWire ?? false;

  const standardWires: WireConfig[] = Array.from(
    { length: wireCount },
    (_, index) => ({
      id: createWireId(index),
      index,
      kind: 'standard',
      beadCount: BEADS_PER_WIRE,
    }),
  );

  const wires: WireConfig[] = quarterWireEnabled
    ? [
        ...standardWires,
        {
          id: 'quarter-wire',
          index: standardWires.length,
          kind: 'quarter',
          beadCount: QUARTER_WIRE_BEAD_COUNT,
        },
      ]
    : standardWires;

  return {
    wireCount,
    beadsPerWire: BEADS_PER_WIRE,
    quarterWire: {
      enabled: quarterWireEnabled,
      beadCount: QUARTER_WIRE_BEAD_COUNT,
    },
    wires,
  };
};

export const createInitialBoardState = (config: SchotyConfig): BoardState => {
  const wires: WireState[] = config.wires.map((wireConfig) => ({
    id: wireConfig.id,
    index: wireConfig.index,
    kind: wireConfig.kind,
    beads: Array.from({ length: wireConfig.beadCount }, (_, index) => ({
      id: createBeadId(wireConfig.id, index),
      wireId: wireConfig.id,
      index,
      side: 'parked',
    })),
  }));

  return {
    config,
    wires,
  };
};

export const schotyConfig = createSchotyConfig({
  wireCount: parsePositiveInteger(
    import.meta.env.VITE_SCHOTY_WIRE_COUNT,
    DEFAULT_WIRE_COUNT,
    'VITE_SCHOTY_WIRE_COUNT',
  ),
  enableQuarterWire: parseBoolean(
    import.meta.env.VITE_SCHOTY_ENABLE_QUARTER_WIRE,
  ),
});

export const initialBoardState = createInitialBoardState(schotyConfig);
