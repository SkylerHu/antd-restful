# Contributing Guide

[English](./CONTRIBUTING.md) | [中文](./CONTRIBUTING.zh-CN.md)

This guide is intended for developers, covering important considerations before and during development.

# Development Environment

    node: 18.20.8

Common commands:
- Install dependencies: `npm install .`
- Local development (mock + demo): `npm run start`
- Run tests: `npm run test`

Build and release are managed via Makefile (auto-switches to Node 18):

| Command | Description |
|---|---|
| `make build` | Build main version (father ESM + CJS → `dist/`) |
| `make build-compat` | Build compat version (webpack UMD → `compat/dist/`) |
| `make publish` | Build + publish main version (latest tag) |
| `make publish-compat` | Build + publish compat version (compat tag) |
| `make clean` | Clean all build artifacts |

## Local Development with Other Projects

When you need to test your latest changes in a consumer project, there are two approaches.

### Option 1: npm link

No extra tools required — uses npm's built-in symlink mechanism:

1. Build and create a global link in this repo:
   ```bash
   make build
   npm link
   ```
2. Link the local package in your consumer project:
   ```bash
   npm link antd-restful
   ```
3. After making changes in this repo, simply rebuild (the consumer project automatically picks up the latest output):
   ```bash
   make build
   ```
4. When done, unlink in the consumer project and restore the npm version:
   ```bash
   npm unlink antd-restful
   npm install antd-restful
   ```

> **Note**: `npm link` uses symlinks, which may cause React hooks errors due to multiple React instances (one in this repo, one in the consumer project). If you encounter this issue, use yalc instead.

### Option 2: yalc (Recommended)

`yalc` simulates a real install process by copying the package into the consumer project's `node_modules`, avoiding the multiple-instance problem caused by symlinks.

1. Install globally (first time):
   ```bash
   npm i -g yalc
   ```
2. Build and publish to the local yalc registry in this repo:
   ```bash
   make build
   yalc publish
   ```
3. Add the local package in your consumer project:
   ```bash
   yalc add antd-restful
   npm install
   ```
4. After making changes in this repo, sync to the consumer project:
   ```bash
   yalc publish              # run in this repo
   yalc update antd-restful && npm install  # run in consumer project
   ```

When done, revert to the official npm version in the consumer project:
```bash
yalc remove antd-restful
npm install antd-restful
```

# Submitting Pull Requests

Before submitting a Pull Request, ensure the following:
- Tests must be included and pass via `npm run test`

# Build & Release

Build output directories:
- `dist/esm` (ESM)
- `dist/cjs` (CJS)

father build behavior:
- Currently uses father's ESM/CJS `bundless` transpilation mode only, without UMD single-file bundling.
- This mode preserves `import/require` for dependencies and does not inline them into a single bundle.
- This mode does not run terser minification, so class/method names are not obfuscated.

Release process:
```bash
make publish
```

## Publishing the Compat Version (0.x)

The `0.x` version line is for publishing Node 12 / npm 6 compatible versions, intended for legacy projects that cannot upgrade Node. The compat version starts from `0.5.0`.

The compat version has its own `package.json` located in the `compat/` directory. Webpack bundles all dependencies (including `query-string`) into a single file `compat/dist/index.js`, ensuring zero external dependencies and Node 12 syntax compatibility.

```bash
make publish-compat
```

Consumers install via `npm install antd-restful@compat`.

> **Notes**:
> - `0.x` and the main version (`1.x`) may not be feature-identical; only essential bugfixes are backported.
> - `query-string` can stay at `9.x` — webpack will bundle and transpile it to compatible syntax automatically.
> - Before publishing, confirm that the `version` field in `compat/package.json` has been updated.
