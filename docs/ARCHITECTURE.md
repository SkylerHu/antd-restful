# Architecture

[English](./ARCHITECTURE.md) | [中文](./ARCHITECTURE.zh-CN.md)

## Background & Motivation

In typical admin panels and operations dashboards, 80% of pages follow the same pattern: fetch data from a RESTful API, render it in a table or list, and provide filtering, pagination, and sorting. Developers end up writing repetitive boilerplate — wiring axios calls, managing loading states, syncing URL parameters, handling pagination math, and coordinating filter forms with table refreshes.

**antd-restful** was created to eliminate this boilerplate. Instead of imperatively orchestrating data fetching and UI updates, developers declare *what* to display and *where* to fetch it. The library handles the rest: request lifecycle, parameter management, error handling, and Ant Design component integration.

### Target Scenarios

- **Admin panels** with dozens of CRUD list views
- **Operations dashboards** requiring shareable, bookmark-able filter states via URL
- **Dynamic JSON-driven UIs** where page structure is defined by configuration rather than code
- **Multi-team projects** where consistent patterns reduce onboarding friction

## Design Philosophy

### 1. Configuration over Code

The core principle is **declarative configuration**. A `RestTable` with a `restful` URL and `columns` array produces a fully functional data table — no `useEffect`, no `useState`, no manual `axios.get()`. Configuration objects replace imperative code wherever possible.

### 2. Sensible Defaults, Full Override

Default values align with **Django REST framework (DRF)** conventions (`page`/`page_size`/`results`/`count`), since DRF is one of the most common REST API patterns. Every default is overridable via `setRestOptions` (global) or per-component props — the library adapts to any backend.

### 3. Composition, Not Inheritance

Components compose through props and children rather than deep class hierarchies. `RouteBaseTable` wraps `RestTable`/`RestList`, `GridForm` wraps standard antd `Form`, and form items like `RestSelect` extend antd's `Select` with remote-data capabilities. Each component adds a thin layer while delegating rendering to Ant Design.

### 4. Zero Lock-in on Ant Design Internals

The library treats Ant Design as a **rendering layer**. Props like `antdTableProps`, `antdSpaceProps`, and `antdFieldProps` provide transparent passthrough to the underlying antd components. This ensures that any antd feature — even future ones — remains accessible without waiting for a library update.

### 5. Cross-version Resilience

Supporting antd 4.24+, 5.x, and 6.x means handling API differences (e.g., `direction` vs. `orientation` on `Space`, `dayjs` vs. `moment`, deprecated props). A centralized `versionUtil` module detects the antd major version at runtime, and components branch behavior accordingly.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Consumer Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Configuration Layer                  │       │
│  │  setRestOptions · setGlobalConfig · setTextOptions│       │
│  └──────────────┬───────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │              Component Layer                      │       │
│  │                                                   │       │
│  │  ┌─────────────────┐  ┌────────────────────┐    │       │
│  │  │  RouteBaseTable  │  │     GridForm       │    │       │
│  │  │  (URL sync)      │  │  (filter form)     │    │       │
│  │  └───────┬──────────┘  └────────┬───────────┘    │       │
│  │          │                      │                 │       │
│  │  ┌───────▼──────────────────────▼───────────┐    │       │
│  │  │         RestTable / RestList              │    │       │
│  │  │  (data fetch + render + pagination)       │    │       │
│  │  └───────┬──────────────────────┬────────────┘    │       │
│  │          │                      │                 │       │
│  │  ┌───────▼────────┐  ┌─────────▼──────────┐     │       │
│  │  │   Form Items   │  │  Display Helpers    │     │       │
│  │  │  RestSelect    │  │  LongText           │     │       │
│  │  │  RestCascader  │  │  CopyView           │     │       │
│  │  │  UploadView    │  │  CompareEdit        │     │       │
│  │  │  ...           │  │                     │     │       │
│  │  └────────────────┘  └─────────────────────┘     │       │
│  └──────────────────────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │              Infrastructure Layer                 │       │
│  │                                                   │       │
│  │  requests.jsx    hooks/     common/               │       │
│  │  (axios +        (useInterval,  (parser,           │       │
│  │   safe request    useStorage,    typeTools,         │       │
│  │   + cancel)       useProtect)    formatter,         │       │
│  │                                  constants,         │       │
│  │                                  versionUtil)       │       │
│  └──────────────────────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │              External Dependencies                │       │
│  │  axios · query-string · object-path · dequal      │       │
│  │  Ant Design · React                               │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── index.js              # CJS entry (re-exports from entry.js)
├── entry.js              # Named exports for all components, tools, hooks
├── config.js             # Global config: restOptions, globalConfig, textOptions
├── requests.jsx          # Axios instance, interceptors, AbortablePromise, useSafeRequest
│
├── common/               # Pure utility functions (no React dependency)
│   ├── constants.js      # Enums: FieldType, SorterEnum, ViewType, FilterType
│   ├── typeTools.js      # Type guards: isNull, isBlank, isEmpty, isNumber, etc.
│   ├── parser.js         # Data parsing: query-string wrappers, sorter conversion, tree utils
│   ├── formatter.js      # Number/byte/percentage formatting
│   ├── sorter.js         # Local sorting and filtering logic
│   ├── dateUtils.js      # dayjs/moment adapter
│   ├── treeUtils.js      # Tree data transformation
│   ├── validators.js     # Form validators: expansion, remote, range
│   └── versionUtil.js    # Ant Design major version detection
│
├── hooks/                # React hooks
│   ├── index.jsx         # Re-exports
│   ├── base.jsx          # useDeepCompareMemoize, useDictState
│   ├── protect.jsx       # useProtect (callback guard against unmount)
│   ├── interval.jsx      # useInterval (pausable timer)
│   └── storage.jsx       # useLocalStorage, useSessionStorage, useSettingsStorage
│
└── components/           # React components
    ├── RestTable.jsx      # Core RESTful table
    ├── RestList.jsx       # Core RESTful list
    ├── RouteBaseTable.jsx # URL-sync wrapper for RestTable/RestList
    ├── GridForm.jsx       # Configurable filter form
    ├── FieldsSetting.jsx  # Column visibility settings (localStorage-backed)
    ├── LongText.jsx       # Truncated text with modal
    ├── CopyView.jsx       # One-click copy
    └── formitems/         # Form-level sub-components
        ├── index.js
        ├── RestSelect.jsx
        ├── TableSelect.jsx
        ├── RestAutoComplete.jsx
        ├── RestCascader.jsx
        ├── RestTreeSelect.jsx
        ├── UploadView.jsx
        ├── DateStrPicker.jsx
        ├── RangeStrPicker.jsx
        ├── ExpansionView.jsx
        ├── NumberRange.jsx
        ├── CompareEdit.jsx
        └── MentionView.jsx
```

## Core Concepts

### Request Lifecycle

Every data-fetching component follows the same lifecycle:

1. **Parameter Assembly** — Merge `baseParams`, form filters, route params, pagination, sorting, and `forceParams` into a single query object.
2. **Request Dispatch** — Send via the shared axios instance (`requests.jsx`), which attaches CSRF tokens and serializes params via `query-string`.
3. **Cancellation** — Each new request cancels the previous one using `AbortController`. The `AbortablePromise` wrapper ensures unmounted components don't trigger state updates.
4. **Response Parsing** — Extract rows and total count from the response via configurable paths (`parseRowsPath` / `parseTotalPath`).
5. **State Update** — Update internal state, triggering antd's `Table` or `List` to re-render.

### Safe Requests (`makeSafeRequest`)

The `makeSafeRequest` factory creates a scoped request manager with:

- **Auto-cancellation**: Re-requesting with the same key cancels the inflight request.
- **Debounce**: An optional `delay` parameter batches rapid-fire requests (useful for search-as-you-type).
- **Unmount cleanup**: `makeRequest.unmount()` aborts all pending requests, called automatically by `useSafeRequest` in `useEffect` cleanup.

### Parameter Priority

Parameters are merged with a clear priority chain (later overrides earlier):

```
baseParams < routeParams < formFilters < pagination/sorting < forceParams
```

`forceParams` always wins, making it suitable for tenant isolation or feature flags.

### Configuration Layers

| Layer | Scope | API |
|---|---|---|
| **Global Config** | Query serialization, text labels | `setGlobalConfig()`, `setTextOptions()` |
| **REST Options** | Pagination fields, response paths, defaults | `setRestOptions()` |
| **Component Props** | Per-instance overrides | `fieldPage`, `parseRowsPath`, etc. |

Component props override REST options, which override global defaults.

### URL Synchronization (`RouteBaseTable`)

`RouteBaseTable` bridges the component state with the browser URL:

1. On mount, it parses the current URL query string into initial filter values.
2. On filter change, it calls `onSearchChange` to update the URL (via the consumer's router).
3. It auto-infers query parameter types (number vs. string) from column/field definitions using `guessQueryTypes`, avoiding manual type annotations.
4. Supports `viewType` switching between table and list views, persisted in the URL.

## Component Hierarchy

### Data Components

```
RouteBaseTable
  ├── RestTable (viewType="table")
  │     ├── GridForm (filterFormProps)
  │     ├── FieldsSetting (column visibility)
  │     └── Ant Design Table
  │
  └── RestList (viewType="list")
        ├── GridForm (filterFormProps)
        └── Ant Design List
```

### Form Items

All form items follow the **controlled component** pattern (`value` + `onChange`), making them compatible with `Form.Item`. Shared capabilities:

- **Remote data loading**: `restful` + `searchKey` + `parseRowsPath` + `fieldNames`
- **Read-only mode**: `readOnly` prop renders a static display instead of an input
- **Label templates**: `labelTemplate` with `{field}` placeholders for composite labels
- **Copy support**: `enableCopy` adds a copy button to multi-select components

## Cross-version Compatibility

The `versionUtil` module exports:

- `antdMajorVersion` — The detected antd major version (4, 5, or 6)
- `isAntd5Plus` / `isAntd6Plus` — Boolean flags

Components use these to:

| Difference | antd 4 | antd 5+ | antd 6+ |
|---|---|---|---|
| Date library | `moment` | `dayjs` | `dayjs` |
| Space layout prop | `direction` | `direction` | `orientation` |
| Tabs destroy prop | `destroyInactiveTabPane` | `destroyInactiveTabPane` | `destroyOnHidden` |

The `dateUtils` module wraps date creation/formatting to work with whichever library is installed.

## Build & Distribution

The library ships two build targets via **father**:

| Output | Format | Path | Use Case |
|---|---|---|---|
| ESM | ES Modules | `dist/esm/` | Modern bundlers (Vite, webpack 5, etc.) |
| CJS | CommonJS | `dist/cjs/` | Node.js, older bundlers |

Both are **bundless** transpilations — dependencies remain external `import`/`require` statements, not inlined. This keeps bundle size minimal and avoids version conflicts with the consumer's dependency tree.

A separate **compat** build (`0.x`) exists for Node 12 environments, produced by webpack as a single UMD file with all dependencies inlined.

## Documentation

Documentation is built with [dumi v2](https://d.umijs.org/) with i18n support:

- **English** (default): `docs/site/*.md`
- **Chinese**: `docs/site/*.zh-CN.md`
- **Live demos**: Code blocks with `jsx` language tag are rendered as interactive examples
- **API tables**: Written in markdown, styled by dumi's default theme

Deploy target: GitHub Pages at `https://skylerhu.github.io/antd-restful/`.
