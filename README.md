# alex-1883-develop-a-obacus

A Vite, React, and TypeScript schoty abacus app.

## Local Development

Install dependencies and start the Vite dev server on `0.0.0.0:8080`:

```bash
npm install
npm run dev
```

## Verification

Run the unit and end-to-end test suites before shipping changes:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

The production build command runs TypeScript project checks and then writes the
static Vite output to `dist/`.

## Build-Time Configuration

Vite only exposes client-side build variables prefixed with `VITE_`. Copy
`.env.example` to `.env` or provide these variables in the build environment:

```bash
VITE_SCHOTY_WIRE_COUNT=10
VITE_SCHOTY_ENABLE_QUARTER_WIRE=false
```

`VITE_SCHOTY_WIRE_COUNT` controls the number of standard wires.
`VITE_SCHOTY_ENABLE_QUARTER_WIRE=true` adds the optional quarter wire.

## Self-Hosted Static Deploy

Build the app:

```bash
npm ci
npm run build
```

Deploy the contents of `dist/` as a static directory. The Vite base path is
relative, so `dist/index.html` references its bundled assets under `./assets/`
and can be served from a domain root, a subdirectory, or a simple file/directory
host.

Example static-server smoke test:

```bash
npm run preview
```

Then open `http://localhost:8080/`. For production, configure the host to serve
`dist/index.html` and the `dist/assets/` files with normal static-file caching.
