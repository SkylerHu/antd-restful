---
title: RestAutoComplete
order: 3
---

## RestAutoComplete
A remote auto-complete input built on Ant Design AutoComplete, supporting remote data search and custom field mapping.

**Features:**
- Remote data search
- Search debouncing
- Custom field name mapping
- Custom label templates
- Read-only display
- Minimum search character limit

### Props
| <div style="width: 20ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through AutoComplete `style` | - |
| className | Custom class name | `string` | - | Pass-through AutoComplete `className` | - |
| value | Currently selected value | `any` | - | Pass-through AutoComplete `value` | - |
| onChange | Callback when value changes | `function(value)` | - | Pass-through AutoComplete `onChange` | - |
| **Remote Data** | | | | | |
| restful | Remote data API URL | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| baseParams | API filter parameters | `object` | - | - | - |
| searchKey | Search keyword parameter name | `string` | `'search'` | - | - |
| searchMinEnter | Minimum characters before search | `number` | `1` | - | - |
| parseRowsPath | Path to parse data from API response | `string` | `'results'` | - | - |
| **Display & Interaction** | | | | | |
| options | Option list | `array` | - | Overrides AutoComplete `options`; managed internally in remote mode | - |
| fieldNames | Field name mapping (not natively supported by the base component) | `object` | - | - | - |
| labelTemplate | Label template for remote API data | `string` | - | - | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through AutoComplete `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdAutoCompleteProps | Native props for Ant Design [AutoComplete](https://ant.design/components/auto-complete) | `object` | - | Pass-through AutoComplete props; `value` / `onChange` / `options` / `onSearch` managed internally | - |

### Field Mapping Config (fieldNames)
```javascript
{
  value: 'id',    // Option value field name
  label: 'name'   // Option label field name
}
```

### Search Mechanism
1. **Debouncing**: 200ms debounce delay when typing search keywords
2. **Minimum length**: Controlled by `searchMinEnter`
3. **Empty search**: Allowed when `searchMinEnter` is 0
4. **Loading state**: Shows loading indicator during search

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

const staticOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export default () => {
  const [mode, setMode] = useState('edit');
  const [remoteValue, setRemoteValue] = useState('');
  const [staticValue, setStaticValue] = useState('');

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Remote Search</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <RestAutoComplete
            style={{ width: 320 }}
            restful="https://dummyjson.com/users/search"
            parseRowsPath="users"
            value={remoteValue}
            onChange={setRemoteValue}
            readOnly={readOnly}
            disabled={disabled}
            fieldNames={{ value: 'firstName', label: 'firstName' }}
            labelTemplate="{firstName} (@{username})"
            searchKey="q"
            antdAutoCompleteProps={{ style: { width: 320 }, placeholder: 'Search by username' }}
          />
          <div style={valueStyle}>Form value: {remoteValue}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Static Options</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <RestAutoComplete
            style={{ width: 320 }}
            options={staticOptions}
            value={staticValue}
            onChange={setStaticValue}
            readOnly={readOnly}
            disabled={disabled}
            antdAutoCompleteProps={{ style: { width: 320 } }}
          />
          <div style={valueStyle}>Form value: {staticValue}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Advanced Usage

#### Complex Search Parameters
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

export default () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <RestAutoComplete
        style={{ width: 320 }}
        restful="https://dummyjson.com/users/search"
        parseRowsPath="users"
        value={value}
        onChange={setValue}
        baseParams={{ limit: 10 }}
        searchKey="q"
        fieldNames={{ value: 'id', label: 'firstName' }}
        labelTemplate="{firstName} (@{username})"
        antdAutoCompleteProps={{ style: { width: 320 } }}
      />
      <div>Form value: {value}</div>
    </div>
  );
};
```

#### Custom Data Parsing
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

export default () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <RestAutoComplete
        style={{ width: 320 }}
        restful="https://dummyjson.com/users/search"
        value={value}
        onChange={setValue}
        parseRowsPath="users"
        fieldNames={{ value: 'id', label: 'firstName' }}
        antdAutoCompleteProps={{ style: { width: 320 } }}
      />
      <div>Form value: {value}</div>
    </div>
  );
};
```

### API Response Format
Expected API response format:

```javascript
{
  "users": [
      {
        "id": 1,
        "firstName": "Emily",
        "email": "emily.johnson@x.dummyjson.com"
      },
      {
        "id": 2,
        "firstName": "Michael",
        "email": "michael.williams@x.dummyjson.com"
      }
  ],
  "total": 208
}
```

With different `parseRowsPath`:
```javascript
{
  "products": [
        {
          "id": 1,
          "title": "Essence Mascara Lash Princess"
        }
      ]
}
```

### Request Parameters
- **Search parameter**: User input passed via parameter name specified by `searchKey`
- **Base parameters**: `baseParams` appended to every request
- **Example request**: `GET https://dummyjson.com/users/search?q=emily&limit=10`

### Remote API Requirements
- API must support keyword search (e.g. `q` / `search`) and return matching list.
- List items must include value and label fields (e.g. `id` and `firstName/title`), mapped via `fieldNames`.
- Response structure must align with `parseRowsPath` (e.g. `users` or `products`).
- Pagination/limit parameters recommended to avoid large datasets.
- Response time of 200ms–500ms recommended for best debounce experience.

### Field Mapping Recommendations
- `RestAutoComplete` uses `fieldNames.value` as the input display value; if you set `value: 'id'`, the input shows `id`.
- To display text like name/title in the input, map `fieldNames.value` to a text field (e.g. `firstName`, `title`).
- Common user API response: `{ id, firstName, email }`, recommended:
  - `parseRowsPath="users"`
  - `fieldNames={{ value: 'firstName', label: 'firstName' }}`
  - `labelTemplate="{firstName} (@{username})"`
- Common product API response: `{ id, title }`, recommended:
  - `parseRowsPath="products"`
  - `fieldNames={{ value: 'title', label: 'title' }}`
  - `labelTemplate="{title}"`

### Notes
1. **Search debouncing**: Built-in 200ms debounce to avoid frequent requests
2. **Minimum input length**: `searchMinEnter` controls minimum search length to reduce invalid requests
3. **Field mapping**: `fieldNames` maps API response fields to component format
4. **Label template**: `labelTemplate` supports `{fieldName}` syntax for custom display
5. **Read-only mode**: Displays text content directly, no input box
6. **Loading state**: Shows loading indicator during search
7. **Empty search**: When `searchMinEnter` is 0, search triggers even when input is empty
8. **Data parsing**: Use `parseRowsPath` to specify path for parsing data from API response
9. **Native props**: Pass any Ant Design AutoComplete native props via `antdAutoCompleteProps`

### Related Components
- [RestSelect](./rest-select.md) - Remote select
- [MentionView](./mention-view.md) - Mention input
- [TableSelect](./table-select.md) - Table select
