# Product Contract

## Project

This repository contains a browser-based schoty abacus implemented with Vite,
React, TypeScript, and Tailwind CSS.

## Current User Experience

The app renders an interactive schoty board with a wooden frame, horizontal
wires, and beads that move between parked and active sides. Users can drag or
tap beads with pointer input, or operate beads with the keyboard using Enter,
Space, ArrowRight for parked beads, and ArrowLeft for active beads. A live value
readout updates from the bead state, and a reset control returns all beads to
the starting position.

The layout is responsive down to narrow mobile viewports and includes semantic
groups, pressed-state bead buttons, live value announcements, and screen-reader
instructions for bead operation.

## Domain Model

The schoty state is modeled as immutable board, wire, and bead types. Standard
wires contain 10 beads. Configuration supports a build-time wire count and an
optional quarter wire with 4 beads. Bead movement and value computation are pure
functions in the domain layer.

Value computation treats standard wires as decimal place values starting at
ones, and the optional quarter wire as quarter units.

## Configuration

Build-time configuration uses Vite client variables:

- `VITE_SCHOTY_WIRE_COUNT`
- `VITE_SCHOTY_ENABLE_QUARTER_WIRE`

Defaults are documented in `.env.example`.

## Build, Test, And Deploy

Primary commands:

- `npm run dev` starts Vite on `0.0.0.0:8080`.
- `npm run lint` runs ESLint.
- `npm run test` runs Vitest unit tests for movement and value logic.
- `npm run test:e2e` runs Playwright interaction and responsive checks.
- `npm run build` runs TypeScript checks and emits static output to `dist/`.

The Vite base path is relative (`./`), so the production `dist/` directory can
be served from a domain root, subdirectory, or simple static file/directory host.
