---
title: RestSelect
order: 1
---

## RestSelect
A remote select built on Ant Design Select, supporting remote data fetching, search, multi-select, and more.

**Features:**
- Remote data fetching and search
- Single and multi-select modes
- Data caching and deduplication
- Copy support
- Read-only display
- Custom field name mapping
- Custom label templates

### Props
| <div style="width: 21ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Select `style` | - |
| className | Custom class name | `string` | - | Pass-through Select `className` | - |
| value | Selected value | `any` | - | Pass-through Select `value` | - |
| onChange | Callback when value changes | `function(value, option)` | - | Pass-through Select `onChange` | - |
| **Remote Data** | | | | | |
| restful | Remote API URL for fetching data | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| urlDetailTemplate | API URL template for initializing options by value via GET; input is the initial value (array for multi-select) | `string` | - | - | - |
| baseParams | API filter parameters | `object` | - | - | - |
| searchKey | Parameter name for fuzzy search | `string` | `'search'` | - | - |
| fieldPageSize | Parameter name for page size; used to set page_size dynamically in detail requests | `string` | `'page_size'` | - | - |
| searchMinEnter | Minimum characters before search; 0 allows fetching remote options when empty | `number` | `0` | - | - |
| parseRowsPath | Path to parse list data from API response | `string` | `'results'` | - | - |
| **Display & Interaction** | | | | | |
| enableCopy | Whether to enable copy | `boolean` | `false` | - | - |
| separator | Separator between values when copying | `string` | `','` | - | - |
| labelTemplate | Label template for remote API data | `string` | - | - | - |
| **Native Component Support** | | | | | |
| labelInValue | When enabled, `fieldNames` config is ignored | `boolean` | `false` | Pass-through Select `labelInValue` | - |
| fieldNames | Same as antd official config; maps option key/value fields | `object` | - | Pass-through Select `fieldNames` | - |
| options | Initial dropdown options | `array` | - | Overrides Select `options`; remote data managed internally | - |
| mode | Selection mode; default single, set to `'multiple'` for multi-select | `string` | - | Pass-through Select `mode` | - |
| disabled | Whether disabled | `boolean` | `false` | Pass-through Select `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props | - |
| antdSelectProps | Native props for Ant Design [Select](https://ant.design/components/select) | `object` | - | Pass-through Select props; `value` / `onChange` / `options` / `loading` / `onSearch` managed internally | - |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

export default () => {
  const [mode, setMode] = useState('edit');
  const [singleValue, setSingleValue] = useState(1);
  const [multipleValue, setMultipleValue] = useState([1, 2]);

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
          <RestSelect
            options={options}
            value={singleValue}
            onChange={setSingleValue}
            readOnly={readOnly}
            disabled={disabled}
            antdSelectProps={{ style: { width: 320 } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(singleValue)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Multi Select + Copy</Divider>
        <Form.Item label="Multi value" style={{ marginBottom: 8 }}>
          <RestSelect
            options={options}
            mode="multiple"
            value={multipleValue}
            onChange={setMultipleValue}
            readOnly={readOnly}
            disabled={disabled}
            enableCopy
            style={{ width: 320 }}
            antdSpaceProps={{ block: false }}
            antdSelectProps={{ style: { width: 280 } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(multipleValue)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Advanced Usage

#### Custom Detail API URL
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

export default () => {
  const [value, setValue] = useState(123);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RestSelect
        style={{ width: 320 }}
        restful="https://dummyjson.com/users"
        parseRowsPath="users"
        fieldPageSize="limit"
        fieldNames={{ value: 'id', label: 'firstName' }}
        urlDetailTemplate="https://dummyjson.com/users/{0}"
        value={value}
        onChange={setValue}
      />
      <div>Form value: {String(value ?? '')}</div>
    </div>
  );
};
```

#### Complex Search Parameters
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

export default () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RestSelect
        style={{ width: 320 }}
        restful="https://dummyjson.com/products"
        parseRowsPath="products"
        fieldPageSize="limit"
        value={value}
        onChange={setValue}
        baseParams={{
          limit: 10
        }}
        searchKey="q"
        searchMinEnter={3}
        fieldNames={{ value: 'id', label: 'title' }}
        labelTemplate="{title} - ¥{price}"
      />
      <div>Form value: {String(value ?? '')}</div>
    </div>
  );
};
```

### Notes
1. **Remote data**: When using `restful`, the component automatically debounces search requests
2. **Data caching**: Selected options are cached to avoid duplicate requests
3. **Field mapping**: Use `fieldNames` to customize field mapping for complex data structures
4. **Search optimization**: `searchMinEnter` controls minimum search length to reduce invalid requests
5. **Copy**: When `enableCopy` is enabled, a copy button appears in read-only mode or next to the select
6. **labelInValue**: When enabled, returned value includes label info and `fieldNames` config is ignored

### Related Components
- [RestCascader](./rest-cascader.md) - Remote cascader
- [RestTreeSelect](./rest-tree-select.md) - Remote tree select
- [RestAutoComplete](./rest-auto-complete.md) - Remote auto complete
- [TableSelect](./table-select.md) - Table select
