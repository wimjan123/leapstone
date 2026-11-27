# Contributing to Leapstone

Thank you for your interest in contributing to Leapstone!

## Getting Started

1. Fork the repository and clone your fork.
2. Install prerequisites listed in [README.md](README.md) (Rust stable, Node.js 22+, and GTK/WebKitGTK dev libraries if testing `halma-app` on Linux).
3. Install web dependencies and build the core WebAssembly module:
   ```sh
   npm --prefix web ci
   npm --prefix web run wasm
   ```

## Running Tests

Run targeted tests while iterating:

```sh
# Core rules and computer opponent
cargo test -p halma-core

# Storage layer (SQLite)
cargo test -p halma-opslag --features rusqlite

# Push notification crypto and formatting
cargo test -p halma-push

# Worker API tests
cargo test -p leapstone-worker

# Frontend unit tests and Svelte/TypeScript type check
npm --prefix web test
npm --prefix web run build:site
```

Before opening a pull request, run the full check script:

```sh
scripts/volledige-check.sh
```

## Conventions

- **Languages:** Public documentation and user-facing source strings (in `web/src/talen/en.ts`) are written in English. Much of the existing Rust and TypeScript codebase uses Dutch identifiers and comments; match the surrounding style in the files you touch.
- **No move hints:** By design, Leapstone does not highlight legal target squares during regular games (only inside the interactive tutorial). Invalid moves simply roll back.
- **Server authority:** In online games, the server (`halma-opslag` / `leapstone-worker`) always validates moves. Client-side checks are for responsiveness only.
- **Tests:** Add focused tests covering computed or decision-making behavior through public interfaces. Avoid tests that rely on live network calls or wall-clock sleeps.
- **Formatting:** Follow `.editorconfig` (4 spaces for Rust, 2 spaces for TypeScript/Svelte/JSON/YAML).

## Pull Requests

1. Create a focused branch from `main`.
2. Keep pull requests small and scoped to one change.
3. Explain what changed and why in the pull request description.
4. Make sure CI passes cleanly.

## License

By contributing to Leapstone, you agree that your contributions will be licensed under the same license as the project (`AGPL-3.0-only`, see [LICENSE](LICENSE)).
