---
title: TableSelect
order: 2
---

## TableSelect
A table select built on RestTable, supporting multi-row selection, selected data display, deselection, and more. Suitable for scenarios requiring multi-select in a table.

**Features:**
- Multi-row selection in table form
- Display of selected data
- Deselection support
- Collapsible/expandable selected data area
- Read-only and disabled modes
- Fully inherits all RestTable features

### Props
| <div style="width: 19ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| value | Value must be an array of objects | `array<object>` | - | - | - |
| onChange | Callback when value changes | `function(selectedRows)` | - | - | - |
| **Interaction Control** | | | | | |
| disabled | Becomes read-only when disabled | `boolean` | `false` | - | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| expandSelected | Whether to expand selected data by default | `boolean` | `true` | - | - |
| **Data Config** | | | | | |
| rowKey | Unique key for table rows | `string` | `'id'` | Pass-through Table `rowKey` | - |
| columns | Table column config | `array` | `[]` | Pass-through Table `columns` | - |
| titleTemplate | Title template for selected count; must include `{count}` placeholder | `string` | `{count} item(s) selected` | - | - |
| titleAggPath | Aggregate selected data by field for title display; use `{stat}` placeholder in titleTemplate | `string` | - | - | 0.1.2 |
| **Ant Design Native Config** | | | | | |
| antdTableProps | Native props for Ant Design [Table](https://ant.design/components/table) | `object` | - | Pass-through Table props; `rowSelection` / `dataSource` managed internally | - |
| antdTableReadProps | Config for read-only Table; overrides antdTableProps | `object` | - | Pass-through read-only Table props | - |
| antdCollapseProps | Native props for Ant Design [Collapse](https://ant.design/components/collapse) | `object` | - | Pass-through Collapse props | - |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props | - |
| **RestTable Props** | | | | | |
| ...restProps | Inherits all other RestTable props | - | - | - | - |

### Data Format
- **Input value**: Must be an array of objects `[{}, {}, ...]`
- **Output value**: Array of selected row data objects

### Component Structure
1. **Selected data area**: Collapsible panel showing selected data in a table
2. **Data selection area**: RestTable for browsing and selecting data
3. **Deselect**: Each row in selected data has a deselect button

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
];

export default () => {
  const [mode, setMode] = useState('edit');
  const [selectedRows, setSelectedRows] = useState([]);

  const readOnly = mode === 'readOnly';
  const disabled = mode === 'disabled';

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="readOnly">Read-only</Radio.Button>
        <Radio.Button value="disabled">Disabled</Radio.Button>
      </Radio.Group>

      <Form layout="horizontal" labelCol={{ flex: '100px' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Table Multi-Select</Divider>
        <Form.Item label="Selected data" style={{ marginBottom: 8 }}>
          <TableSelect
            restful="https://dummyjson.com/users"
            parseRowsPath="users"
            parseTotalPath="total"
            fieldPage="skip"
            fieldPageSize="limit"
            baseParams={{ limit: 8 }}
            value={selectedRows}
            onChange={setSelectedRows}
            columns={columns}
            rowKey="id"
            readOnly={readOnly}
            disabled={disabled}
            antdTableProps={{ size: 'small' }}
          />
          <div style={valueStyle}>Form value: {selectedRows.length} item(s) selected</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Advanced Usage

#### Form Integration Example
```jsx
import React from 'react';
import { Form, Button } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
  ];

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    console.log('Selected users:', values.selectedUsers);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="selectedUsers"
        label="Select users"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value || value.length === 0) {
                return Promise.reject('Please select at least one user');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <TableSelect
          restful="https://dummyjson.com/users"
          parseRowsPath="users"
          parseTotalPath="total"
          fieldPage="skip"
          fieldPageSize="limit"
          baseParams={{ limit: 10 }}
          columns={columns}
          rowKey="id"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

#### Custom Collapse Panel Example
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TableSelect
        restful="https://dummyjson.com/products"
        parseRowsPath="products"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        baseParams={{ limit: 10 }}
        value={selectedRows}
        onChange={setSelectedRows}
        columns={columns}
        rowKey="id"
        expandSelected={false}
        antdCollapseProps={{
          size: 'small',
          ghost: true,
          collapsible: 'header',
        }}
      />
      <div>Currently selected rows: {selectedRows.length}</div>
    </div>
  );
};
```

#### Large Data Table with Pagination Example
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'tags',
      key: 'tags',
      width: 100,
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TableSelect
        restful="https://dummyjson.com/posts"
        parseRowsPath="posts"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        baseParams={{ limit: 10 }}
        value={selectedRows}
        onChange={setSelectedRows}
        columns={columns}
        rowKey="id"
        antdTableProps={{
          scroll: { y: 400 },
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          },
          rowSelection: {
            preserveSelectedRowKeys: true,
          },
        }}
      />
      <div>Currently selected rows: {selectedRows.length}</div>
    </div>
  );
};
```

### Behavior
1. **Selection**: Click row checkboxes to select/deselect
2. **Selected data display**: Selected data shown in a table inside a collapsible panel
3. **Deselect**: Each row in selected data has a red X button for deselection
4. **Data persistence**: Selected rows persist across pagination and search
5. **Deduplication**: Deduplicates based on `rowKey` to avoid duplicate selections

### State Management
- **disabled**: Component becomes read-only and selection is disabled
- **readOnly**: Only shows selected data, hides data selection area
- **expandSelected**: Controls whether selected data area is expanded by default

### Notes
1. **Data format**: value must be an array of objects, each containing the field specified by `rowKey`
2. **rowKey uniqueness**: Ensure `rowKey` field values are unique in the data
3. **Column config**: `columns` applies to both selection table and selected data table
4. **Inherited props**: Component inherits all RestTable props, supporting pagination, search, sorting, etc.
5. **Selection persistence**: Use `preserveSelectedRowKeys` to keep selection across page changes
6. **Deselect**: Component automatically adds a deselect column to the selected data table
7. **Ant Design compatibility**: Automatically adapts to Ant Design v4 and v5 Collapse API differences

### Remote API Requirements
- List API must support pagination field mapping (e.g. `fieldPage` / `fieldPageSize`) and return total count (`parseTotalPath`).
- List data path must align with `parseRowsPath` (e.g. `users` / `products` / `posts`).
- Each row must have a stable unique key (matching `rowKey`, e.g. `id`).
- If quick search is enabled, backend must support fuzzy query via `searchKey` parameter.
