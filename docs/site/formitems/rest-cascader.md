---
title: RestCascader
order: 4
---

## RestCascader
A remote cascader built on Ant Design Cascader, supporting remote lazy loading, multi-select, copy, and more.

**Features:**
- Remote lazy loading
- Single and multi-select modes
- Tree structure display
- Copy support
- Read-only display
- Custom field name mapping
- Dynamic parent-child loading

### Props
| <div style="width: 21ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Cascader `style` | - |
| className | Custom class name | `string` | - | Pass-through Cascader `className` | - |
| value | Selected value (array format representing path) | `array` | - | Pass-through Cascader `value` | - |
| onChange | Callback when value changes | `function(value, selectedOptions, treeOpts)` | - | Overrides Cascader `onChange`, adds treeOpts parameter | - |
| **Remote Data** | | | | | |
| restful | Remote data API URL | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| baseParams | Base request parameters | `object` | - | - | - |
| fieldParent | Parent field name | `string` | `'parent'` | - | - |
| parseRowsPath | Path to parse data | `string` | `'results'` | - | - |
| **Display & Interaction** | | | | | |
| enableCopy | Whether to enable copy | `boolean` | `false` | - | - |
| separator | Separator for path display and copy | `string` | `' / '` | - | - |
| **Native Component Support** | | | | | |
| options | Static data | `array` | - | Overrides Cascader `options`; managed internally in remote mode | - |
| fieldNames | Field mapping config | `object` | - | Pass-through Cascader `fieldNames` | - |
| disabled | Whether disabled | `boolean` | `false` | Pass-through Cascader `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props | - |
| antdCascaderProps | Native props for Ant Design [Cascader](https://ant.design/components/cascader) | `object` | - | Pass-through Cascader props; `value` / `onChange` / `options` / `loadData` managed internally | - |

### Field Mapping Config (fieldNames)
```javascript
{
  value: 'id',        // Option value field name
  label: 'name',      // Option label field name
  children: 'children' // Child options field name
}
```

### Data Loading Mechanism
1. **Lazy loading**: Root nodes loaded first, child nodes loaded dynamically on expand
2. **Parent-child relationship**: Established via `fieldParent` field
3. **Deduplication**: Avoids duplicate requests for the same node
4. **Caching**: Loaded node data is cached

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [basicValue, setBasicValue] = useState();
  const [multiValue, setMultiValue] = useState([]);
  const [staticValue, setStaticValue] = useState();
  const [separatorValue, setSeparatorValue] = useState();
  const [fieldNamesValue, setFieldNamesValue] = useState();

  const readOnly = mode === 'readOnly';
  const disabled = mode === 'disabled';

  const options = [
    {
      value: 'beijing',
      label: 'Beijing',
      children: [
        {
          value: 'haidian',
          label: 'Haidian District',
        },
        {
          value: 'chaoyang',
          label: 'Chaoyang District',
        },
      ],
    },
    {
      value: 'shanghai',
      label: 'Shanghai',
      children: [
        {
          value: 'huangpu',
          label: 'Huangpu District',
        },
      ],
    },
  ];

  const mappedOptions = [
    {
      id: 'tech',
      name: 'Engineering',
      nodes: [
        { id: 'frontend', name: 'Frontend Team' },
        { id: 'backend', name: 'Backend Team' },
      ],
    },
    {
      id: 'product',
      name: 'Product',
      nodes: [
        { id: 'pm', name: 'Product Manager Team' },
        { id: 'ux', name: 'UX Design Team' },
      ],
    },
  ];

  // labelTemplate style: pre-process options to generate display fields.
  const templatedOptions = mappedOptions.map((item) => ({
    ...item,
    displayName: `${item.name} (${item.id})`,
    nodes: (item.nodes || []).map((child) => ({
      ...child,
      displayName: `${child.name} (${child.id})`,
    })),
  }));

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="readOnly">Read-only</Radio.Button>
        <Radio.Button value="disabled">Disabled</Radio.Button>
      </Radio.Group>

      <Form layout="horizontal" labelCol={{ flex: '100px' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Basic Cascader (Static Renderable)</Divider>
        <Form.Item label="Select path" style={{ marginBottom: 8 }}>
          <RestCascader
            style={{ width: 320 }}
            options={options}
            value={basicValue}
            onChange={setBasicValue}
            readOnly={readOnly}
            disabled={disabled}
            antdCascaderProps={{ placeholder: 'Select city path' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(basicValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Multi Select + Copy</Divider>
        <Form.Item label="Multi path" style={{ marginBottom: 8 }}>
          <RestCascader
            style={{ width: 320 }}
            options={options}
            value={multiValue}
            onChange={setMultiValue}
            readOnly={readOnly}
            disabled={disabled}
            enableCopy
            antdCascaderProps={{ multiple: true, placeholder: 'Select multiple city paths' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(multiValue)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Static Data</Divider>
        <Form.Item label="Select path" style={{ marginBottom: 8 }}>
          <RestCascader
            style={{ width: 320 }}
            options={options}
            value={staticValue}
            onChange={setStaticValue}
            readOnly={readOnly}
            disabled={disabled}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(staticValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 4: Custom Separator</Divider>
        <Form.Item label="Select path" style={{ marginBottom: 8 }}>
          <RestCascader
            style={{ width: 320 }}
            options={options}
            value={separatorValue}
            onChange={setSeparatorValue}
            readOnly={readOnly}
            disabled={disabled}
            separator=" > "
          />
          <div style={valueStyle}>Form value: {JSON.stringify(separatorValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 5: fieldNames + labelTemplate Style Display</Divider>
        <Form.Item label="Organization path" style={{ marginBottom: 8 }}>
          <RestCascader
            style={{ width: 320 }}
            options={templatedOptions}
            value={fieldNamesValue}
            onChange={setFieldNamesValue}
            readOnly={readOnly}
            disabled={disabled}
            fieldNames={{ value: 'id', label: 'displayName', children: 'nodes' }}
            antdCascaderProps={{ placeholder: 'Select organization path (template label)' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(fieldNamesValue ?? null)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Advanced Usage

#### Custom Field Mapping
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

export default () => {
  const [value, setValue] = useState();
  const options = [
    {
      id: 'dept-a',
      text: 'Department A',
      items: [
        { id: 'group-a1', text: 'Group A1' },
        { id: 'group-a2', text: 'Group A2' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <div>Scenario: Custom field mapping</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={value}
        onChange={setValue}
        fieldNames={{
          value: 'id',
          label: 'text',
          children: 'items'
        }}
      />
      <div>Form value: {JSON.stringify(value ?? null)}</div>
    </div>
  );
};
```

#### Multi Select Configuration
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

export default () => {
  const [value, setValue] = useState([]);
  const options = [
    {
      value: 'permission',
      label: 'Permissions',
      children: [
        { value: 'read', label: 'Read-only' },
        { value: 'write', label: 'Write' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <div>Scenario: Multi select configuration</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={value}
        onChange={setValue}
        antdCascaderProps={{
          multiple: true,
          maxTagCount: 'responsive',
          placeholder: 'Select permissions',
          showCheckedStrategy: 'SHOW_CHILD'
        }}
        enableCopy
      />
      <div>Form value: {JSON.stringify(value ?? null)}</div>
    </div>
  );
};
```

### API Response Format
Expected API response format:

**Root node request** (parent__isnull=true):
```javascript
{
  "data": {
    "results": [
      {
        "id": 1,
        "name": "Beijing",
        "parent": null,
        "isLeaf": false
      },
      {
        "id": 2,
        "name": "Shanghai",
        "parent": null,
        "isLeaf": false
      }
    ]
  }
}
```

**Child node request** (parent=1):
```javascript
{
  "data": {
    "results": [
      {
        "id": 11,
        "name": "Haidian District",
        "parent": 1,
        "isLeaf": true
      },
      {
        "id": 12,
        "name": "Chaoyang District",
        "parent": 1,
        "isLeaf": true
      }
    ]
  }
}
```

### Request Parameters
- **Initial request**: `{fieldParent}__isnull=true` to fetch root nodes
- **Child node request**: `{fieldParent}={parentValue}` to fetch children of specified parent
- **Base parameters**: `baseParams` appended to every request

### Remote API Requirements
- API must support "query children by parent node", returning next level based on `fieldParent`.
- Data must include unique value field (e.g. `id`) and display field (e.g. `name` / `title`), aligned via `fieldNames`.
- Non-leaf nodes should return `isLeaf: false`; leaf nodes return `isLeaf: true` or no children.
- Root node request should support `parent__isnull=true` (or equivalent backend convention).
- Component triggers lazy loading on expand; API should support frequent small batch requests.

### Notes
1. **Field mapping**: Configure via `fieldNames` for complex data structures
2. **Label template**: Component has no `labelTemplate` prop; pre-process `options` to add display fields and map via `fieldNames.label`
3. **Parent-child relationship**: `fieldParent` specifies parent field for tree structure
4. **Lazy loading**: Child data loaded only on expand for better performance
5. **Leaf nodes**: Determined by `isLeaf` field or empty children array
6. **Multi select**: Enable via `antdCascaderProps.multiple`
7. **Copy**: When enabled, copies full selected path
8. **Read-only mode**: Displays selected paths as tags, supports copy
9. **Data caching**: Loaded node data is cached to avoid duplicate requests
10. **Path value**: value is always array format representing full path from root to leaf
11. **Callback parameters**: onChange provides selected path, selected options, and tree options

### Related Components
- [RestSelect](./rest-select.md) - Remote select
- [RestTreeSelect](./rest-tree-select.md) - Remote tree select
- [RestAutoComplete](./rest-auto-complete.md) - Remote auto complete
