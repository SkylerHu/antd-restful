---
title: ExpansionView
order: 9
---

## ExpansionView
An input component supporting text expansion and remote validation. Processes or validates user input in real time, suitable for scenarios requiring live input processing.

When used in forms, combine with the [expansionValidator](../tools/validators.md#expansionValidator) validator.

**Features:**
- Brace-expansion syntax support
- Remote validation and processing
- Error message display
- Loading state display
- Read-only mode
- Custom output template

### Props
| <div style="width: 19ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | - | - |
| className | Custom class name | `string` | - | - | - |
| value | Current value object containing input, output, error, etc. | `object` | - | - | - |
| onChange | Callback when value changes | `function(value)` | - | - | - |
| **Expansion** | | | | | |
| enableBraceExpansion | When enabled, supports brace-expansion syntax input | `boolean` | `false` | - | - |
| **Remote Processing** | | | | | |
| restful | Remote processing API URL | `string` | - | - | - |
| reqConfig | axios config options | `object` | - | - | - |
| inputKey | Input value sent as value; inputKey is the request key | `string` | `'input'` | - | - |
| inputMinEnter | Minimum input length; only effective when restful is set | `number` | `1` | - | - |
| baseParams | Extra request parameters | `object` | - | - | - |
| valueTemplate | Output value template; `{value}` is input value, other keys from baseParams | `string` | - | - | - |
| **UI Config** | | | | | |
| longTextProps | LongText component props | `object` | - | - | - |
| longErrorProps | Error message LongText component props | `object` | - | - | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through Input `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | Pass-through Input `readOnly` | - |
| **Ant Design Native Config** | | | | | |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props; `direction` / `style` have defaults | - |
| antdInputProps | Native props for Ant Design [Input](https://ant.design/components/input) | `object` | - | Pass-through Input props; `value` / `onChange` / `disabled` / `readOnly` managed internally | - |
| antdAlertProps | Native props for Ant Design [Alert](https://ant.design/components/alert) | `object` | - | Pass-through Alert props; `message` / `type` / `closable` managed internally | - |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { ExpansionView } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [basicValue, setBasicValue] = useState();
  const [templateValue, setTemplateValue] = useState();
  const [remoteValue, setRemoteValue] = useState();

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Basic Brace-Expansion</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <ExpansionView
            value={basicValue}
            onChange={setBasicValue}
            enableBraceExpansion
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ placeholder: 'Enter {a,b,c} to expand', style: { width: 380 } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(basicValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Templated Output</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <ExpansionView
            value={templateValue}
            onChange={setTemplateValue}
            enableBraceExpansion
            valueTemplate="processed_{value}_result"
            baseParams={{ prefix: 'custom' }}
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ placeholder: 'Enter text for templated output', style: { width: 380 } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(templateValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Remote Validation (min 3 characters)</Divider>
        <Form.Item label="Input value" style={{ marginBottom: 8 }}>
          <ExpansionView
            value={remoteValue}
            onChange={setRemoteValue}
            restful="/api/validate"
            inputKey="content"
            inputMinEnter={3}
            baseParams={{ type: 'validation' }}
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ placeholder: 'Enter at least 3 characters to trigger remote validation', style: { width: 380 } }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(remoteValue ?? null)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Value Object Structure
```javascript
{
  input: 'string',     // User input content
  output: 'any',       // Processed output result
  error: 'string',     // Error message
  loading: 'boolean'   // Loading state
}
```

### Brace-Expansion Syntax
Supports bash-like brace expansion syntax:
- `{a,b,c}` → `['a', 'b', 'c']`
- `{1..3}` → `['1', '2', '3']`
- `prefix{a,b}suffix` → `['prefixa suffix', 'prefixbsuffix']`

### Notes
1. **Form validation**: In forms, use with a specific validator checking `!isBlank(input) && !loading && !error`
2. **Debouncing**: Remote requests have 200ms debounce delay
3. **Error handling**: Error messages displayed as red Alert
4. **Output display**: Success results displayed as green Alert
5. **Template syntax**: `valueTemplate` supports `{value}` and fields from `baseParams`

### Related Components
- [RestSelect](./rest-select.md) - Remote select
- [TableSelect](./table-select.md) - Table select
- [CopyView](../components/copy-view.md) - Copy-enabled text component
