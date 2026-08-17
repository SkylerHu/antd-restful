---
title: RouteBaseTable
order: 1
---

## RouteBaseTable
A route-synced table built on the RestTable component. It syncs table filter parameters to the URL query string so filter state persists after page refresh.

**Features:**
- Route sync: table filter parameters are automatically synced to the URL query string
- State persistence: previous filter state is restored automatically after page refresh
- Parameter filtering: parameters identical to default params are filtered out to avoid redundant URL params
- Multi-view support: supports both `table` and `list` view modes via `viewType`
- Compatibility: compatible with react-router v5 and v6
- Deep comparison: uses deep comparison to ensure accurate parameter change detection
- Smart type inference: automatically infers URL parameter parse types from `columns` and `filterFormProps`
- Callback support: supports custom callbacks for filter and search changes

### API

| <div style="width: 21ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| location | Route location object containing current URL info | `object` | - | - | - |
| onSearchChange | Callback when search params change, used to update the route | `function(search)` | - | - | - |
| viewType | View type; supports `'table'` and `'list'` modes | `string` | `'table'` | - | - |
| restProps | All props passed to RestTable/RestList | `object` | - | - | - |

**Key parameters in restProps:**
| <div style="width: 21ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| baseParams | Base request parameters; filtered when identical to URL params | `object` | - | - | - |
| onFiltersChange | Callback when filter conditions change | `function(filters)` | - | - | - |
| parseOptions | Options for parsing query params; [query-string](https://www.npmjs.com/package/query-string) configuration | `object` | - | - | 0.1.14 |
| parseTypes | (Deprecated) Specifies field parse types to fix precision loss for very large numbers in older query-string versions | `object` | - | - | - |
| Other params | All parameters supported by RestTable/RestList | - | - | - | - |


**Special notes on parseOptions.types**
- Starting from version `0.2.0`, `query-string@9` was upgraded to support `parseOptions.types` for specifying parse types per key
- Default `types` are initialized from configured `columns` and `filterFormProps.fields`; see the `parser.guessQueryTypes` implementation for details
  - `FiledType.INPUT` defaults to `string`
  - `FieldType.SELECT` defaults to array
  - `FieldType.CHECKBOX`, `FieldType.NUMBER_RANGE`, `FieldType.DATE_RANGE_PICKER` default to array
  - Columns with `filters` configured also default to array
  - All arrays use `number[]`; string values are also handled correctly

### Examples

Wrap a reusable route-synced table component with ref forwarding and view switching

```jsx | pure
import React, { forwardRef } from 'react';
import PropTypes from "prop-types";
import { useLocation, useNavigate } from 'react-router';
import antdRestful from 'antd-restful';

const { RouteBaseTable, constants } = antdRestful;

const { ViewType } = constants;

const RouteTable = forwardRef(({ viewType = ViewType.TABLE, ...restProps }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RouteBaseTable
      ref={ref}
      viewType={viewType}
      restProps={restProps}
      location={location}
      onSearchChange={(search) => {
        navigate(`${location.pathname}${search}`);
      }}
    />
  );
});
RouteTable.displayName = 'RouteTable';
RouteTable.propTypes = {
  viewType: PropTypes.oneOf(ViewType.map((o) => o.value)),
};
```

Using the wrapped component

```jsx | pure
import React from 'react';
import RouteTable from './RouteTable'

const UserList = () => {
  return (
    <RouteTable
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      columns={[
        {
          title: "ID",
          dataIndex: "id",
          width: 80,
        },
        {
          title: "Username",
          dataIndex: "username",
          sorter: true,
        },
        {
          title: "Name",
          dataIndex: "firstName",
          sorter: true,
        },
      ]}
      baseParams={{
        limit: 10,
      }}
      tools={{
        advancedSearch: true,
        settings: true,
      }}
    />
  );
};
```

#### Using filterFormProps?.fields and parseOptions.types together

```jsx | pure
import React from 'react';
import antdRestful from 'antd-restful';
import RouteTable from './RouteTable'

const { constants: { FieldType } } = antdRestful;

const UserListWithRangeFields = () => {

  const restProps = {
    restful: "https://dummyjson.com/users",
    parseRowsPath: "users",
    parseTotalPath: "total",
    fieldPage: "skip",
    fieldPageSize: "limit",
    columns: [
      {
        title: "Age",
        dataIndex: "age",
        sorter: true,
        filterDropdownConfig: {
          type: FieldType.NUMBER_RANGE,
        },
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        sorter: true,
        filterDropdownConfig: {
          type: FieldType.DATE_RANGE_PICKER,
        },
      },
    ],
    // Configure URL parameter type parsing
    parseOptions: {
      parseNumbers: false,
      types: {
        age: "number[]",        // Age range converted to number array
        age__range: "number[]",        // Age range converted to number array
        created_at__range: "string[]", // Created-at range converted to string array
      }
    },
    // Configure filter form fields
    filterFormProps: {
      advancedSearch: true,
      antdListProps: {
        grid: { gutter: 24, column: 2 },
      },
      fields: [
        {
          key: "age__range",
          label: "Age Range",
          type: FieldType.NUMBER_RANGE,
          antdFieldProps: {
            placeholder: ["Min Age", "Max Age"],
            min: 0,
            max: 120,
          },
        }
      ],
    }
  };
  // RouteTable was declared in the previous example
  return (
    <RouteTable { ...restProps } />
  );
};
```

### Key Feature Details

#### Route Sync Mechanism
- **URL parameter sync**: range field values are automatically synced to URL query parameters
- **State persistence**: previous range filter state is restored automatically after page refresh
- **Link sharing**: supports sharing links with range filter conditions


### Notes

1. **Route compatibility**: Due to API differences between react-router v5 and v6, you must manually pass the `location` object and `onSearchChange` callback.

2. **Parameter filtering**: The component automatically filters parameters identical to those in `baseParams` to avoid redundant URL params.

3. **Deep comparison**: Uses the `dequal` library for deep comparison to ensure accurate parameter change detection.

4. **Initialization wait**: The component waits until URL parameters are parsed before rendering to avoid flicker.

5. **Callback function**: The `onSearchChange` callback receives the full query string (including the `?` prefix); handle it according to your router library's API.

### Differences from RestTable

| Feature | RestTable | RouteBaseTable |
| - | - | - |
| Route sync | ❌ | ✅ |
| State persistence | ❌ | ✅ |
| URL parameter sync | ❌ | ✅ |
| Complexity | Simple | Requires route configuration |
| Use case | Standalone table | Tables that need state persistence |
