---
title: RestTable
order: 2
---

## RestTable
Remote data loading built on the Ant Design Table component.

**Features:**
- Remote data loading: built on Ant Design Table, loads data from RESTful API endpoints
- Static data support: besides remote loading, also accepts a static data source directly
- Template support: supports `{field}` label templates
- Multiple filter types: input, select, number input, number range, date range, and more
- Flexible configuration: highly configurable column definitions and table behavior
- Toolbar features: built-in advanced search, refresh, download, column visibility settings, and more
- Smart filtering: supports header filters and form filters with automatic parameter merging
- Local storage: supports persisting column visibility settings locally
- Auto refresh: supports interval-based automatic data refresh
- Expandable rows: supports expandable rows displaying details via Descriptions

### API

| <div style="width: 24ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Table `style` | - |
| className | Custom class name | `string` | - | Pass-through Table `className` | - |
| **Remote Data** | | | | | |
| restful | RESTful API endpoint; supports relative paths (e.g. `/api/users`) and absolute URLs (e.g. `https://dummyjson.com/users`) | `string` | - | - | - |
| reqConfig | Request configuration; extra axios request options | `object` | - | - | - |
| parseOptions | Options for parsing query params; [query-string](https://www.npmjs.com/package/query-string) configuration | `object` | - | - | 0.1.14 |
| urlDetailTemplate | Custom URL template for delete operations | `string` | - | - | - |
| baseParams | Base request parameters | `object` | - | - | - |
| routeParams | Route parameters | `object` | - | - | - |
| forceParams | Forced parameters that override route and form parameters | `object` | - | - | - |
| fieldPage | Pagination field name | `string` | `'page'` | - | - |
| fieldPageSize | Page size field name | `string` | `'page_size'` | - | - |
| defaultPageSize | Default page size | `number` | `20` | - | - |
| fieldOrdering | Sort field name | `string` | `'ordering'` | - | - |
| parseRowsPath | Path to parse data rows | `string` | `'results'` | - | - |
| parseTotalPath | Path to parse total count | `string` | `'count'` | - | - |
| showHeaderTags | Whether to show filter conditions on the table header | `boolean` | `false` | - | 0.1.5 |
| **Display & Interaction** | | | | | |
| isActive | Whether active; does not update data when `false` | `boolean` | `true` | - | - |
| tools | Toolbar configuration | `object \| boolean` | `true` | - | - |
| extraTools | Additional toolbar actions | `node` | - | - | 0.1.9 |
| onFiltersChange | Callback when filter conditions change | `function(filters)` | - | - | - |
| onDataSourceChange | Callback when data source changes | `function(dataSource)` | - | - | - |
| rowKey | Row data key | `string` | `'id'` | Pass-through Table `rowKey` | - |
| columns | Table column configuration | `array` | - | Overrides Table `columns` with internal enhancements | - |
| dataSource | Static data source; when set, `restful` is not used | `array` | - | Overrides Table `dataSource`; managed internally | - |
| expandFieldPath | Field path to determine expandable rows; defaults to column configuration when not set | `string` | - | - | 0.1.9 |
| expandAntdProps | Props for Descriptions in expandable columns | `object` | - | Pass-through Descriptions props | 0.1.9 |
| expandedAllRows | Expand all rows even when tools is disabled | `boolean` | - | - | 0.1.9 |
| filterFormProps | Filter form configuration; see [GridForm](./grid-form.md) | `object` | - | - | - |
| **Ant Design Native Config** | | | | | |
| antdTableProps | Ant Design [Table](https://ant.design/components/table-cn) props | `object` | - | Pass-through Table props; `loading` / `rowKey` / `columns` / `dataSource` / `pagination` / `onChange` / `expandable` are managed internally | - |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) props for the outer container | `object` | - | Pass-through Space props | - |

**tools options:**

| <div style="width: 24ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| advancedSearch | Enable search field settings; when `string`, used as storage key | `boolean \| string` | `true` | - | - |
| refreshInterval | Refresh interval in ms; 0 for manual refresh, >0 for auto refresh, <0 to hide refresh button | `number` | `0` | - | - |
| downloadKey | Download parameter name; `true` uses `'_download'`, string uses custom name, `false` disables download | `boolean \| string` | `false` | - | - |
| settings | Column visibility settings; `true` uses restful as storage key, string uses custom key, `false` disables | `boolean \| string` | `true` | - | - |
| expandedAllRows | Whether to expand all rows by default; defaults to collapsed when `false` | `boolean` | - | - | 0.1.9 |

**columns options:**

| <div style="width: 24ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| title | Column title | `string` | - | Pass-through Column `title` | - |
| dataIndex | Path to the field in the data item | `string` | - | Pass-through Column `dataIndex` | - |
| key | Unique column identifier | `string` | - | Pass-through Column `key` | - |
| labelTemplate | Column value display template; supports `{field}` format | `string` | - | - | - |
| copyProps | Copy feature configuration; see [CopyView](./copy-view.md) | `object` | - | - | - |
| copyField | When dataIndex value is an object, field to use when copying | `string` | - | - | 0.1.9 |
| showTag | Display as Tag; useful when data is an array | `boolean` | - | - | - |
| filterDropdownConfig | Custom filter dropdown configuration | `object` | - | Overrides Column `filterDropdown` / `filterIcon` | - |
| dropdownLocalConfig | Frontend Table filter configuration | `object` | - | - | - |
| filterMultiple | Whether multi-select filtering is supported | `boolean` | - | Pass-through Column `filterMultiple` | - |
| fieldName | Actual field name used for local filtering | `string` | - | - | - |
| hidden | Whether to hide this column by default | `boolean` | `false` | - | - |
| sorter | Sort configuration | `boolean \| function` | - | Pass-through Column `sorter`; `sortOrder` managed internally in remote mode | - |
| filters | Filter options | `array` | - | Pass-through Column `filters` | - |
| expandable | Whether to show in expandable row feature | `boolean` | - | - | 0.1.9 |
| expandableItemProps | Display style configuration | `object` | - | Pass-through Descriptions.Item props | 0.1.9 |
| render | Custom render function | `function(text, record, index)` | - | Pass-through Column `render` | - |

**filterDropdownConfig options:**

| <div style="width: 24ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| type | Filter type | `'input' \| 'select' \| 'number' \| 'number-range' \| 'date-range-picker'` | - | - | - |
| style | Custom style for the filter dropdown | `object` | - | - | - |
| antdSpaceProps | Controls layout of input components and buttons | `object` | - | Pass-through Space props | - |
| dropdownProps | Props for the dropdown component | `object` | - | Pass-through corresponding filter component props | - |

**Ref methods:**

| Method | Description | Parameters | Return Value |
| - | - | - | - |
| refreshList | Refresh table data | - | - |
| deleteRow | Delete a specific row | `row` | - |

### Examples

**Basic usage:**

```jsx
import React, { useRef } from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;

// Basic usage example
const BasicTable = () => {
  const tableRef = useRef();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Nickname",
      dataIndex: "firstName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Age",
      dataIndex: "age",
      render: (value, record) => `${value} years old`,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyProps: { showIcon: true },
    },
    {
      title: "City",
      dataIndex: "address",
      labelTemplate: "City: {city}",
    },
  ];

  return (
    <RestTable
      ref={tableRef}
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      columns={columns}
      rowKey="id"
      baseParams={{
        limit: 5,
      }}
      tools={{
        settings: "rest-table-basic",
      }}
      onFiltersChange={(filters) => {
        console.log('Filter conditions changed:', filters);
      }}
      onDataSourceChange={(data) => {
        console.log('Data source changed:', data);
      }}
    />
  );
};

export default BasicTable;
```

**Table with filter form:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;

const TableWithFilter = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Nickname",
      dataIndex: "firstName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
  ];

  return (
    <RestTable
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      columns={columns}
      baseParams={{
        limit: 5,
      }}
      tools={{
        settings: "rest-table-filter",
      }}
      filterFormProps={{
        antdListProps: {
          grid: { gutter: 10, xs: 1, sm: 2, md: 3 }
        },
        fields: [
          {
            key: 'q',
            label: 'Keyword',
            type: FieldType.INPUT,
            antdFieldProps: {
              placeholder: 'Search username/name/email'
            }
          }
        ]
      }}
    />
  );
};

export default TableWithFilter;
```

**Local data table:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable } = antdRestful;

const LocalDataTable = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      fieldName: "name", // Field name for local filtering
      filters: [
        { text: "Alice", value: "Alice" },
        { text: "Bob", value: "Bob" },
      ],
    },
    {
      title: "Age",
      dataIndex: "age",
      fieldName: "age",
      sorter: true, // Local sorting
    },
    {
      title: "City",
      dataIndex: "city",
      fieldName: "city",
      filters: [
        { text: "Beijing", value: "Beijing" },
        { text: "Shanghai", value: "Shanghai" },
      ],
    },
  ];

  const dataSource = [
    { id: 1, name: 'Alice', age: 25, city: 'Beijing' },
    { id: 2, name: 'Bob', age: 30, city: 'Shanghai' },
    { id: 3, name: 'Charlie', age: 28, city: 'Beijing' },
  ];

  return (
    <RestTable
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      tools={false} // Disable toolbar
    />
  );
};

export default LocalDataTable;
```

**Advanced configuration example:**

```jsx
import React, { useRef } from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;
import { Button, message, Space } from 'antd';

const AdvancedTable = () => {
  const tableRef = useRef();

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      copyProps: {
        showIcon: true,
        text: 'Copy username'
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      labelTemplate: "{name} ({title})",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      render: (value) => `${Number(value ?? 0).toFixed(2)} kg`,
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    message.info(`View user: ${record.username}`);
  };

  const handleDelete = (record) => {
    if (tableRef.current) {
      tableRef.current.deleteRow(record);
    }
  };

  const handleRefresh = () => {
    if (tableRef.current) {
      tableRef.current.refreshList();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleRefresh}>Manual Refresh</Button>
      </div>

      <RestTable
        ref={tableRef}
        restful="https://dummyjson.com/users"
        parseRowsPath="users"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        urlDetailTemplate="https://dummyjson.com/users/{id}" // Custom delete URL template
        columns={columns}
        reqConfig={{
          timeout: 10000, // 10 second timeout
          headers: {
            'Custom-Header': 'value'
          }
        }}
        tools={{
          advancedSearch: true,
          refreshInterval: 60000, // Auto refresh every 1 minute
          downloadKey: true,       // Use default _download parameter
          settings: "rest-table-advanced"
        }}
        baseParams={{
          limit: 5
        }}
        forceParams={{
          // Forced parameters that cannot be overridden
          company_id: 123
        }}
        onFiltersChange={(filters) => {
          console.log('Current filter conditions:', filters);
        }}
        antdTableProps={{
          size: 'small',
          scroll: { x: 1000 },
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }
        }}
      />
    </div>
  );
};

export default AdvancedTable;
```

### Toolbar Details

**Advanced search toggle:**
- Click the advanced search button to expand/collapse the filter form
- Automatically expands advanced search when multiple filter conditions are active

**Auto refresh:**
- Enabled when `refreshInterval > 0`
- Click the refresh button to toggle auto refresh on/off
- `refreshInterval = 0` for manual refresh mode
- `refreshInterval < 0` hides the refresh button

**Download:**
- Supports downloading current page or all data
- Download URL automatically includes current filter and sort parameters
- Custom download parameter name supported

**Column visibility settings:**
- Supports show/hide column configuration
- Settings are automatically saved to localStorage
- Supports select all / invert
- Custom storage key supported

### Filter Details

**Header filters:**
- Supports input and select types
- Input supports fuzzy search
- Select supports remote data loading
- Filter values are automatically synced to URL parameters

**Form filters:**
- Implemented with the GridForm component
- Supports all GridForm field types
- Can switch between single-field mode and advanced search mode

**Local filters:**
- When `restful` is not configured, supports local filtering and sorting
- Requires `fieldName` to specify the actual field name
- Supports filtering across multiple data types

### Best Practices

1. **Performance optimization:**
   - Set reasonable page sizes to avoid loading too much data at once
   - Use `forceParams` to avoid unnecessary parameter changes
   - For large tables, consider virtual scrolling

2. **User experience:**
   - Configure toolbar features appropriately to avoid feature overload
   - Use column visibility settings to let users customize display
   - Provide clear feedback for filtering and sorting

3. **Data handling:**
   - Use `labelTemplate` to simplify display of complex data
   - Use `copyProps` appropriately to improve data operation efficiency
   - Configure appropriate parse paths for different API response formats

4. **Error handling:**
   - Configure appropriate request timeouts
   - Use `reqConfig` to add necessary request headers
   - Implement callbacks for data changes


### FAQ

1. **Toolbar overlaps filter form fields**

There are 2 solutions:

1) Do not dynamically set column count based on screen size; the component will handle overlap based on the column count in `grid`:
```js
filterFormProps: {
  antdListProps: grid: { gutter: 30, column: 3 },
}
```

2) Add a placeholder field at the end of `filterFormProps.fields`, for example:
```js
{
  key: "__placeholder",
  label: "Placeholder",
  tip: "Search button is blocked; enable this to control line wrapping",
  hidden: true,
  antdFormItemProps: {
    hidden: true,
  },
}
```

2. **Handling precision loss for very large query parameter values**
1) Upgrade to `query-string > 9.1` and configure `parseOptions.types` to specify field types
2) If using `RouteBaseTable`, use `parseTypes` for compatibility mapping
```js
<RouteBaseTable
  location={location}
  onSearchChange={(query) => setSearchParams(query)}
  parseOptions={{
    parseNumbers: false,  // Disable number conversion
    // types: {  // requires query-string > 9.1
    //   user: "number",
    // },
  }}
  parseTypes={{
    // Note: configuring string is ineffective because query-string processes first, then parseTypes converts to number
    // Note: use together with parseOptions.parseNumbers = false
    user: "number",
  }}
  ...
/>
```

