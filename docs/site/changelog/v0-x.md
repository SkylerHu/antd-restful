# Changelog (0.x)

This file documents the historical changes for the 0.x releases.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## 0.5.2 - 2026-08-22

### Notes

- Synced with mainline `1.0.5`.

---

## 0.5.1 - 2026-08-11

### Changed

- Synced mainline `1.0.4` changes: `CompareEdit` added `getValueFromEvent`/`valuePropName` props to automatically handle antd native component `onChange` differences.

### Notes

- Feature parity with mainline version `1.0.4`.

---

## 0.5.0 - 2026-08-10

### Added

- First compatibility release, bundling all dependencies into a single UMD file via webpack (`compat/dist/index.js`) for direct use in Node 12 / npm 6 environments.
- Standalone `compat/package.json` declaring `peerDependencies` (react, antd, axios, etc.) and `peerDependenciesMeta` (dayjs, moment optional).
- Install via `npm install antd-restful@compat` or `npm install antd-restful@0.5.0`.
- Import: `import * as antdRestful from "antd-restful"`.

### Notes

- Feature parity with mainline version `1.0.3`.
- Subsequent `0.x` releases only backport necessary bugfixes.

---

## 0.4.0

### Added

- Refactored scattered constant defaults into unified global configuration, supporting dynamic updates at the entry point.
  - Added and independently exported `restOptions` object in `src/config.js` (includes DRF-style defaults such as `fieldPage`, `parseRowsPath`, `fieldParent`, `rowKey`) with accompanying `setRestOptions` method.
  - Removed defaults from original `constants.js` (e.g. `DEFAULT_PAGE_SIZE`); `RestList`, `RestTable`, and other list/form components now read defaults dynamically from `restOptions`.
  - Package entry `src/entry.js` now exposes `globalConfig`, `setGlobalConfig`, `restOptions`, and `setRestOptions`.

### Fixed

- Fixed critical issue where package entry `src/entry.js` failed to export `setGlobalConfig`, preventing external global configuration (e.g. setting `queryStringify`).
- `RestList` / `RestTable` may trigger multiple onChange requests on first load.
- `RestList` / `RestTable` with `restful` enabled had abnormal loading initialization during component mount; now initializes correctly.
- `RestList` / `RestTable` pagination `pageSize` and `current` may not update in time due to closure references.
- `RestTable` removed internal `<Table loading={loading} />` prop to avoid conflicts with or inability to override upper-layer injection.
- Fixed `RestList` `pageSize` parameter dependency causing occasional layout misalignment warnings.
- `demo` project compatible with antd v5 and v4 date library differences (dayjs vs moment), and loads antd styles in v4 environment.

---

## 0.3.2

### Added

- `RestSelect` added `fieldPageSize` parameter; detail requests on init automatically set `page_size` to the count of values to query, ensuring all corresponding options are fetched in one request.

### Changed

- `RouteTable` demo component refactored with `forwardRef` for ref forwarding; added `viewType` parameter for view switching.

### Docs

- Updated `RouteBaseTable` usage docs; examples aligned with demo code.

---

## 0.3.1

### Added

- `UploadView` added `preserveResponse` parameter to retain the full server `response` data on file objects.

### Fixed

- `UploadView` now logs upload failures with `console.error` for easier debugging.
- `RestList` delayed `grid.column` divisibility validation until filters finish initializing, avoiding false positives with default pageSize.

---

## 0.3.0

### Added

- Added `RestList` component, wrapping Ant Design List with remote data loading support.
  - Supports loadMore and pagination modes; pagination takes priority over loadMore
  - Supports filterFormProps filter form rendered in List header
  - Supports grid layout and validates page_size vs grid.column divisibility (console.error when not satisfied)
  - renderItem exposed directly without wrapping List.Item; provides `RestList.Item` equivalent to `List.Item`
- Added `ViewType` enum (`constants.ViewType`) with TABLE and LIST values.
- `RouteBaseTable` added `viewType` parameter to switch to RestList rendering via `ViewType.LIST`.
  - viewType="list" recommended with pagination; not recommended with loadMore

### Docs

- Improved component usage documentation.

---

## 0.2.4

### Fixed

- Adjusted `GridFrom` to handle hidden fields with `<Form.item hidden/>` instead of filtering them out entirely.

---

## 0.2.3

### Fixed

- Fixed FieldsSettings error when configured label is a node type and dequal comparison fails.
  - Not always reproducible; mainly occurs when value changes frequently
- Fixed GridForm warning when calling form.setFieldsValue with no configured form items.
  - Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?
  - Because Form is not rendered when no form items are configured

---

## 0.2.2

### Fixed

- Fixed RestTable hidden columns not taking effect.
  - columns configured with `hidden: True` were not set back to `False` after manual settings

---

## 0.2.1

### Fixed

- Adjusted `useSettingsStorage`: manually configured visible fields remain effective when field configuration columns change.

---

## 0.2.0

### Changed

- Improved RestTable and RouteBaseTable route parameter handling.
  - Upgraded query-string@9; `parseOptions` supports field types via `types` (bundled, no extra install needed)
  - Defaults initialize `types` from `columns` or `filterFormProps.fields` configuration types

### Fixed

- Unified default value handling for `NumberRange` and `RangeStrPicker`, with `defaultEmptyValue` for per-field defaults.
- `parser.queryString` removed `{skipNull:true, skipEmptyString: true}` from default query-string parameters.
  - To handle Range components with null values, e.g. [null, 1] should become ",1"
  - RestTable calls `clearEmptyValue` internally when making remote requests to strip empty values
- Fixed RangeStrPicker dayjs not correctly handling format on antd>=5.
- Fixed `typeTools.isNumber` judgment; `""` is not a number.

---

## 0.1.18

### Fixed

- Fixed RestTable form values updating too frequently when route parameters change.
  - After adjustment, note the behavior of `route parameters` and `form parameters`
    - Form fields configured as `visible` filters cannot be `manually` added from the route (in principle, route params for any key cannot be manually modified regardless of field visibility) (manual route addition supported from 0.2.0)
    - Clicking `reset` clears filter conditions for hidden form items (clicking search does not clear them, supporting share-link scenarios where filters can be modified after opening)
    - Hidden filter fields cannot be set while they have values; clear data first before hiding
  - Fixed search/reset buttons triggering multiple requests
  - Fixed form filter value handling for `,1` multi-select scenarios (e.g. CheckBox, Select multi-select)
  - `columns[].filterMultiple` is optional; inferred from `columns[].type` for multi-select handling

---

## 0.1.17

### Changed

- Improved RestTable tools button positioning when no filter conditions are present.

---

## 0.1.16

### Fixed

- Regardless of parseOptions settings, RestTable always treats page and page_size as int type.
- Fixed `parseQueryTypes` not correctly handling array values.

---

## 0.1.15

### Fixed

- Fixed RestTable not resetting page to `page=1` when clicking search.
- No toast when requests are cancelled.

### Added

- requests now export `reqInterceptor` and `resInterceptor` for removing interceptors when appropriate.

---

## 0.1.14

### Fixed

- Fixed RestSelect triggering remote calls when restful is not configured.

---

## 0.1.13

### Added

- Adjusted RestTable advancedSearch parameter to control search field visibility.

### Fixed

- RouteBaseTable needs to pass through ref to call RestTable component methods.
- Fixed RestTable refreshList via ref losing parameters (reordered functions so dependencies are defined above usage).
- RestTable added `parseOptions` and `parseTypes` for query parameter handling.
  - query-string in this project defaults to `parseNumbers: true`
  - Although added to RestTable, mainly used in RouteBaseTable to convert query params to object
  - Large numeric values in query may overflow; set to False to treat as strings
- RestTable onFiltersChange callback values `remove` values identical to baseParams and forceParams.
  - Avoids displaying restored original values on the route

---

## 0.1.12

### Changed

- Adjusted spacing between two elements inside TableSelect.

### Fixed

- Fixed TableSelect also supporting advanced search directly.
- Compatible DataStrPicker, RangeStrPicker time handling on v4 (moment) and v5 (dayjs).
- Removed RestTable tools.advancedDefaultOpen; use filterFormProps?.advancedSearch for default advanced filter state.

### Added

- GridForm added submitTitle and resetTitle for button labels.
- Added RouteBaseTable for form and route linkage support.

---

## 0.1.11

### Changed

- Fixed LongText / RestTable component text styles.
  - `white-space: pre-wrap; word-break: break-all` combination for text display, mainly adding word-break
- makeSafeRequest optimized delay mode so a request after long idle does not execute delay logic.

### Fixed

- Fixed RestTable filter form not correctly rendering baseParams filter values.

---

## 0.1.10

### Fixed

- Fixed RestTable styling when tools config is empty.
  - tools display depends on restful config
  - Filter Tag compatible with antd 4.x by setting closable

### Added

- Added validators for form validation.
  - expansionValidator: ExpansionView component validation
  - remoteValidator: remote API data validation

### Changed

- makeSafeRequest with delay debounce optimized so first request does not execute delay.

---

## 0.1.9

### Added

- Extended RestTable.
  - extraTools for custom action buttons
  - tools.advancedDefaultOpen to define default advanced search open state
  - columns.expandable to enable expand functionality
  - columns.fieldValue renamed to columns.copyField

### Fixed

- Fixed GridForm option initialization when advanced search is closed.

---

## 0.1.8

### Fixed

- Fixed RestTable header filter multi-value initial data issue.

---

## 0.1.7

### Changed

- Adjusted RestTable showHeaderTags styling.

---

## 0.1.5

### Added

- Extended RestTable with showHeaderTags to display header filter values.

---

## 0.1.4

### Added

- Extended RestTable.
  - Filter type extended to support FieldType.DATE_RANGE_PICKER for date filtering

### Fixed

- Fixed RestTable columns.filterMultiple default handling for array data.
- RangeStrPicker added defaults `allowClear={true}` `allowEmpty={[true, true]}`.

---

## 0.1.3

### Added

- Extended RestTable.
  - Filter type extended to support FieldType.NUMBER and FieldType.NUMBER_RANGE

### Fixed

- Fixed RestTable minor issues.
  - Fixed filter input placeholder display
  - Local search requires dropdownLocalConfig

---

## 0.1.2

### Added

- Extended TableSelect.
  - titleAggPath to aggregate and display selected data stats in title
- Extended LongText.
  - titleTemplate, titleAggPath for count display

---

## 0.1.1

### Fixed

- Extended RestTable.
  - defaultPageSize initializes pagination page size
  - dropdownLocalConfig sets frontend table search conditions; see commonFilter implementation
- Extended TableSelect.
  - titleTemplate for selected count title template
  - antdTableReadProps for read-only Table properties

---

## 0.1.0 (2025-07-07)

- Build: lib release
