---
title: Configuration
order: 1
---

# Global Configuration

`antd-restful` provides a flexible global configuration system for aligning with backend (such as Django REST Framework) API field conventions and handling URL query parameter serialization.

By adjusting global configuration in one place, you can avoid repeating the same property settings every time you use `RestTable`, `RestList`, or form components.

## `restOptions`

Common field configuration for requests and data parsing. Default settings:

```javascript
export const restOptions = {
  // Pagination request parameter: current page field
  fieldPage: "page",
  // Pagination request parameter: page size field
  fieldPageSize: "page_size",
  // Search keyword field for list queries
  searchKey: "search",
  // Sort field
  fieldOrdering: "ordering",
  // Object path for list data in API response (DRF default returns { count: 0, results: [] })
  parseRowsPath: "results",
  // Object path for total count in API response
  parseTotalPath: "count",
  // Separator for multi-select array values
  separator: ",",
  // Default page size
  defaultPageSize: 20,
  // Default primary key field for lists/tables
  rowKey: "id",
  // Default parent node field for tree or cascader structures
  fieldParent: "parent",
};
```

### `setRestOptions(options)`

Dynamically updates the default options above. After updating, if a component re-renders due to state changes (or newly mounts) and does not explicitly pass a property, it will automatically read the latest `restOptions`.

**Usage Examples:**

```javascript
import antdRestful from "antd-restful";
const { setRestOptions } = antdRestful;

// Integrate with non-DRF backend services (e.g. Java or Spring Boot custom wrappers)
setRestOptions({
  fieldPage: "current",            // Change current page parameter name to current
  fieldPageSize: "size",           // Change page size parameter name to size
  parseRowsPath: "data.records",   // List data path is data.records
  parseTotalPath: "data.total",    // Total count path is data.total
  rowKey: "uuid",                  // Change primary key to uuid
});
```

## `globalConfig`

Configuration for lower-level serialization and deserialization utility methods.

```javascript
const globalConfig = {
  // URL query parameter serialization method
  queryStringify: (params, options) => queryString.stringify(params, options),
  // URL query parameter deserialization method
  queryParse: (params, options) => queryString.parse(params, options),
  // Component text configuration
  textOptions,
};
```

### `setGlobalConfig(config)`

When you need to adjust array or object serialization formats during network requests (default uses `query-string` capabilities), you can override these two methods to match backend parsing requirements.

**Usage Examples:**

```javascript
import antdRestful from "antd-restful";
const { setGlobalConfig } = antdRestful;
import Qs from "qs";

// Replace with qs library and specify arrays in bracket format
// e.g.: ids[]=1&ids[]=2
setGlobalConfig({
  queryStringify: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
  queryParse: (string) => Qs.parse(string, { arrayFormat: 'brackets' }),
});
```

## `textOptions`

Global configuration for component text. Default settings:

```javascript
export const textOptions = {
  // Default text when no data in dropdown, autocomplete, etc.
  notFoundContent: "No Data",
  // Common button text (top-level config, btn prefix)
  btnSubmitTitle: "Search",
  btnResetTitle: "Reset",
  btnCancelTitle: "Cancel",
};
```

### `setTextOptions(options)`

Dynamically updates default text values. After updating, components will read the latest text on re-render or new mount.

**Usage Examples:**

```javascript
import antdRestful from "antd-restful";
const { setTextOptions } = antdRestful;

setTextOptions({
  notFoundContent: "No Data",
  btnSubmitTitle: "Search",
  btnResetTitle: "Reset",
  btnCancelTitle: "Cancel",
});
```

---

> **Note:** It is recommended to call `setRestOptions`, `setTextOptions`, and `setGlobalConfig` once at the top-level entry file of your React application (such as the beginning of `src/index.js` or `src/App.js`) to ensure stable effect across all components.
