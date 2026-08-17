# Changelog

This file documents all notable changes to this project.

## [1.0.4](https://github.com/skylerhu/antd-restful/compare/v1.0.3...v1.0.4) - 2026-08-11

### Added

- `CompareEdit` added `getValueFromEvent` and `valuePropName` props to automatically handle antd native component `onChange` callback differences (e.g. `Input`'s `e.target.value`, `Checkbox`'s `e.target.checked`), aligning with `Form.Item` value extraction logic.
- `CompareEdit` automatically forwards the child component's original `onChange` callback to avoid losing internal child logic.

### Docs

- All component docs under `docs/site/formitems/` now include edit/read-only/disabled interaction toggle buttons; demos use `Form.Item` horizontal layout.
- `overview.md` added a comprehensive form item example with remote data source (`dummyjson.com`), supporting submit (Modal displays JSON) and reset actions.
- `compare-edit.md` added `onChange` compatibility notes and a complete demo.

### Tests

- Added unit tests for `CompareEdit` with `Input`, `Switch`, `Checkbox`, `Checkbox.Group`, and custom `getValueFromEvent` scenarios.

---

## [1.0.3](https://github.com/skylerhu/antd-restful/compare/v1.0.2...v1.0.3) - 2026-08-10

### Changed

- `RestList` improved `grid.column` divisibility validation: added `filtersInited` guard to avoid false checks before filters initialize; delayed execution by 1 second to avoid interference during initialization; changed log level from `console.error` to `console.warn`.

---

## [1.0.2](https://github.com/skylerhu/antd-restful/compare/v1.0.1...v1.0.2) - 2026-08-09

### Added

- `src/config.js` added global text config `textOptions` and `setTextOptions` for unified component button and empty-data message text.

### Changed

- `GridForm` default button text now reads from `textOptions` (`btnSubmitTitle`, `btnResetTitle`); single-item mode submit button also reuses this config.
- `MentionView`, `RestAutoComplete`, and `RestTreeSelect` default `notFoundContent` text now uniformly reads from `textOptions.notFoundContent`.
- `RestTreeSelect` with `enableCopy=true` now applies default `TreeSelect` width `style={{ width: "100%" }}` to avoid unstable control width when no style is passed.
- Package entry `src/entry.js` now exports `textOptions` and `setTextOptions` for unified business-side configuration.

### Docs

- Updated `tools/config` and `components/grid-form` docs with `textOptions`, `setTextOptions`, and default button text source notes.

### Tests

- `tests/config.test.jsx` added tests for `textOptions` defaults and `setTextOptions` update behavior.
- `tests/GridForm.test.jsx` added tests for default button text and single-item mode button text reading from `textOptions`.

---

## [1.0.1](https://github.com/skylerhu/antd-restful/compare/v1.0.0...v1.0.1) - 2026-08-09

### Added

- Added `src/common/versionUtil.js`, exporting unified antd major version detection (`antdMajorVersion`, `isAntd5Plus`, `isAntd6Plus`).
- Added `test-utils/testVersion.js` for injecting version behavior in tests via `ANTD_TEST_VERSION`.
- Added `.github/workflows/test-antd6.yml` to install `antd@6` and `@ant-design/icons@6` in CI and run the full test suite.

### Changed

- `README.md` added compatibility notes: supports `antd >= 4.24`, with explicit antd5/antd6 test coverage.
- Multiple components (`RestTable`, `RestList`, `FieldsSetting`, `CompareEdit`, `ExpansionView`, `TableSelect`, `UploadView`) now uniformly support antd6 `Space` `orientation` while remaining backward compatible with legacy `direction`.
- `MentionView` antd6 branch uses `loading` + `options` to avoid inconsistent behavior from legacy API differences.
- Demo side adapted to antd API changes: `Tabs` switches between `destroyOnHidden`/`destroyInactiveTabPane` by version, and version utils are used uniformly for date library and page capability checks.
- `GridForm`, `RestTable`, `RestList`, `RouteBaseTable` removed `props.ref` fallback branches, keeping only the `forwardRef` path to avoid invalid ref declarations.

### Fixed

- `dateUtils` removed direct `detectAntdVersion` export; version detection is now unified via `versionUtil.antdMajorVersion` to avoid duplicate APIs and scattered version sources.

### Tests

- `setupTests.js` added runtime patches for `ResizeObserver`, `MessageChannel`, `scrollIntoView`, etc., and skips snapshot assertions in non-antd5 scenarios to reduce cross-version test noise.
- Multiple test files updated antd mock version injection to ensure repeatable branch behavior under antd5/antd6.

---

## [1.0.0](https://github.com/skylerhu/antd-restful/releases/tag/v1.0.0) - 2026-08-08

### Added

- `RouteBaseTable`, `RestTable`, `RestList`, `GridForm` added merged handling for `props.ref` and `forwardRef` (`resolvedRef`), plus `ref` `propTypes` declarations.
- Added `.fatherrc.ts` for father build configuration.
- Added `docs/FAQ.md` documenting the Node 12 `query-string` syntax error workaround.

### Changed

- Build script switched from webpack to `father build`.
- Package entry adjusted to `main=dist/cjs/index.js`, `module=dist/esm/index.js`, with new `exports` (`import`/`require`) mapping ESM/CJS outputs.
- `jsconfig.json` updated to `target/module = es2020` with `@/*`, `src/*`, `demo/*` path mappings.
- Dependency declarations adjusted: `peerDependencies` relaxed to `react/react-dom >=16`, `axios >=1.0.0`, with `dayjs`/`moment` added.
- Multiple `dependencies` changed from broad version ranges (e.g. `^x`) to explicit version ranges.
- Many `src` module imports changed from `src/...` aliases to relative paths to match current build and output structure.
- `README.md` changelog link switched to `docs/CHANGELOG-1.x.md`, with ESM/CommonJS usage notes, optional date library notes, and FAQ entry.
- `docs/CONTRIBUTING.md` added `yalc` local integration workflow and father release notes.


---

See 0.x historical changelog: [0.x Changelog](./v0-x.md)
