---
title: RestTreeSelect
order: 5
---

## RestTreeSelect
A remote tree select built on Ant Design TreeSelect, supporting remote lazy loading, tree display, copy, and more.

**Features:**
- Remote lazy loading
- Tree structure display
- Single and multi-select modes
- Copy support
- Read-only display
- Custom field name mapping

### Props
| <div style="width: 21ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through TreeSelect `style` | - |
| className | Custom class name | `string` | - | Pass-through TreeSelect `className` | - |
| value | Currently selected value | `any` | - | Pass-through TreeSelect `value` | - |
| onChange | Callback when value changes | `function(value, nodes)` | - | Overrides TreeSelect `onChange`, adds nodes parameter | - |
| **Remote Data** | | | | | |
| restful | Remote API URL | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| baseParams | Base request parameters | `object` | - | - | - |
| labelTemplate | Label template | `string` | - | - | - |
| fieldParent | Parent field name | `string` | `'parent'` | - | - |
| parseRowsPath | Path to parse data | `string` | `'results'` | - | - |
| **Field Mapping** | | | | | |
| fieldNames | Field mapping | `object` | - | Pass-through TreeSelect `fieldNames` | - |
| treeNodeLabelProp | Tree node label property | `string` | - | Pass-through TreeSelect `treeNodeLabelProp` | - |
| **State Control** | | | | | |
| enableCopy | Whether to enable copy | `boolean` | `false` | - | - |
| separator | Separator between values when copying in multi-select | `string` | `','` | - | - |
| disabled | Whether disabled | `boolean` | `false` | Pass-through TreeSelect `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| treeData | Static tree data | `array` | - | Overrides TreeSelect `treeData`; managed internally in remote mode | - |
| **Ant Design Native Config** | | | | | |
| antdTreeSelectProps | Native props for Ant Design [TreeSelect](https://ant.design/components/tree-select) | `object` | - | Pass-through TreeSelect props; `value` / `onChange` / `treeData` / `loadData` managed internally | - |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props | - |

### Field Mapping Config (fieldNames)
```javascript
{
  value: 'key',      // Option value field name
  label: 'name',     // Option label field name
  children: 'children' // Child field name
}
```

### Callback Parameters
`onChange` callback receives two parameters:
- `value`: Currently selected value
- `nodes`: Array of currently selected node objects

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RestTreeSelect } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

const treeData = [
  {
    id: 1,
    firstName: 'Emily',
    children: [
      { id: 11, firstName: 'Emily-Child-A' },
      { id: 12, firstName: 'Emily-Child-B' },
    ],
  },
  {
    id: 2,
    firstName: 'Michael',
    children: [
      { id: 21, firstName: 'Michael-Child-A' },
    ],
  },
];

export default () => {
  const [mode, setMode] = useState('edit');
  const [singleValue, setSingleValue] = useState();
  const [multipleValue, setMultipleValue] = useState([]);

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Single Select</Divider>
        <Form.Item label="Selected value" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            style={{ width: 320 }}
            treeData={treeData}
            fieldNames={{ value: 'id', label: 'firstName', children: 'children' }}
            value={singleValue}
            onChange={setSingleValue}
            readOnly={readOnly}
            disabled={disabled}
            antdTreeSelectProps={{ placeholder: 'Select a single node', style: { width: '100%' } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(singleValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Multi Select + Copy</Divider>
        <Form.Item label="Multi value" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            style={{ width: 320 }}
            treeData={treeData}
            fieldNames={{ value: 'id', label: 'firstName', children: 'children' }}
            value={multipleValue}
            onChange={setMultipleValue}
            readOnly={readOnly}
            disabled={disabled}
            antdTreeSelectProps={{ multiple: true, treeCheckable: true, placeholder: 'Select multiple nodes' }}
            enableCopy
          />
          <div style={valueStyle}>Form value: {JSON.stringify(multipleValue)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### API Data Format Example

Expected API response format for RestTreeSelect:

```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Emily",
      "lastName": "Johnson"
    },
    {
      "id": 2,
      "firstName": "Michael",
      "lastName": "Williams"
    }
  ],
  "total": 208
}
```

Where:
- Example uses `parseRowsPath="users"` to parse list data
- `fieldNames` maps `id` / `firstName` to value / label
- For strict tree structure, use a data source with parent/children relationships

### Notes
1. **Field mapping**: Configure via `fieldNames`
2. **Parent-child relationship**: `fieldParent` specifies parent field for tree structure
3. **Lazy loading**: Child data loaded only on expand
4. **Copy**: When enabled, copies selected values
5. **Read-only mode**: Displays selected values as tags
