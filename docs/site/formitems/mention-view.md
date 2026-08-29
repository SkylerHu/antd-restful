---
title: MentionView
order: 12
---

## MentionView
A remote @-mention input built on Ant Design Mentions, supporting remote data search and custom field mapping.

**Features:**
- Remote data search
- @ mention support
- Custom field mapping
- Search debouncing
- Read-only display
- Custom label templates

### Props
| <div style="width: 18ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Mentions `style` | - |
| className | Custom class name | `string` | - | Pass-through Mentions `className` | - |
| value | Current input value | `string` | - | Pass-through Mentions `value` | - |
| onChange | Callback when value changes | `function(value)` | - | Pass-through Mentions `onChange` | - |
| **Remote Data** | | | | | |
| restful | Remote data API URL | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| baseParams | Base request parameters | `object` | - | - | - |
| searchKey | Search keyword parameter name | `string` | `'search'` | - | - |
| searchMinEnter | Minimum characters before search | `number` | `0` | - | - |
| parseRowsPath | Path to parse data from API response | `string` | `'results'` | - | - |
| **Extended Config** | | | | | |
| fieldNames | Field name mapping config | `object` | - | - | - |
| labelTemplate | Label template for remote API data | `string` | - | - | - |
| inValue | Whether to include mention info in value | `boolean` | `false` | - | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through Mentions `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdMentionsProps | Native props for Ant Design [Mentions](https://ant.design/components/mentions) | `object` | - | Pass-through Mentions props; `value` / `onChange` / `onSearch` / `options` / `loading` managed internally | - |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { MentionView } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [basicValue, setBasicValue] = useState('');
  const [inValueData, setInValueData] = useState({ value: '', mentions: [] });

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Basic @ Mention</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <MentionView
            style={{ width: 360 }}
            restful="https://dummyjson.com/users/search"
            parseRowsPath="users"
            value={basicValue}
            onChange={setBasicValue}
            readOnly={readOnly}
            disabled={disabled}
            searchKey="q"
            fieldNames={{ value: 'username', label: 'firstName' }}
            labelTemplate="{firstName} (@{username})"
            antdMentionsProps={{ style: { width: 360 }, rows: 3, placeholder: 'Type @ to mention users' }}
          />
          <div style={valueStyle}>Form value: {basicValue}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: inValue Mode (with mentions structure)</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <MentionView
            style={{ width: 360 }}
            restful="https://dummyjson.com/users/search"
            parseRowsPath="users"
            value={inValueData.value}
            onChange={setInValueData}
            readOnly={readOnly}
            disabled={disabled}
            inValue
            searchKey="q"
            searchMinEnter={1}
            fieldNames={{ value: 'username', label: 'firstName' }}
            labelTemplate="{firstName} (@{username})"
            antdMentionsProps={{ style: { width: 360 }, rows: 3, placeholder: 'Type @ to view mentions structure' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(inValueData)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Field Mapping Config (fieldNames)
```javascript
{
  value: 'username',  // Mention value field name
  label: 'firstName'  // Display label field name
}
```

### Field Mapping Recommendations
- Map `value` to the field you want inserted into text (commonly `username`).
- Map `label` to a user-friendly display field in the dropdown (commonly `firstName` / `name`).
- If API returns `id/title` structure, use:
```javascript
fieldNames={{ value: 'title', label: 'title' }}
```

### Notes
1. **Search debouncing**: Built-in 200ms debounce mechanism
2. **Field mapping**: `fieldNames` maps API response field names
3. **Label template**: `labelTemplate` supports `{fieldName}` syntax for custom display
4. **Mention info**: With `inValue` enabled, onChange returns object containing mentions array
5. **Read-only mode**: Displays text content directly

### Related Components
- [RestSelect](./rest-select.md) - Remote select
- [RestAutoComplete](./rest-auto-complete.md) - Remote auto complete
- [TableSelect](./table-select.md) - Table select
- [GridForm](../components/grid-form.md) - Grid form supporting MentionView as a custom field
