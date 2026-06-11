/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCHOTY_WIRE_COUNT?: string;
  readonly VITE_SCHOTY_ENABLE_QUARTER_WIRE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
