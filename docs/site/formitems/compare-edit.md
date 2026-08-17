---
title: CompareEdit
order: 11
---

## CompareEdit
An editor with history value comparison, displaying differences between current and historical values. Suitable for scenarios requiring before/after data comparison.

**Features:**
- Visual comparison of history and current values
- Comparison of multiple data types (primitives, arrays, objects)
- Read-only, edit, and disabled modes
- Copy support
- Custom label templates and empty value display
- Automatic compatibility with antd native component onChange differences (Input, Checkbox, Switch, etc.)
- Built on Ant Design Space and Tag components

### Props
| <div style="width: 18ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| children | Child component for editing current value | `ReactNode` | - | - | - |
| style | Custom style | `object` | - | - | - |
| className | Custom class name | `string` | - | - | - |
| **Data & Comparison** | | | | | |
| value | Currently selected value | `any` | - | - | - |
| onChange | Callback when value changes | `function(val, ...args)` | - | - | - |
| historyValue | Historical value for comparison with current value | `any` | - | - | - |
| labelTemplate | Display format template; must be unique and distinguishable | `string` | - | - | - |
| fieldValue | Field name to get value from options | `string` | `'value'` | - | - |
| options | When value is primitive, options used to format label | `array` | - | - | - |
| emptyLabel | Empty value display label | `string` | `'(empty)'` | - | - |
| getValueFromEvent | Custom value extraction from onChange event; highest priority | `(...args) => any` | - | - | - |
| valuePropName | Child component value prop name for extracting from event.target | `string` | `'value'` | - | - |
| **Interaction Control** | | | | | |
| enableCopy | Whether to enable copy | `boolean` | `false` | - | - |
| disabled | Whether to disable editing | `boolean` | `false` | - | - |
| readOnly | Read-only mode; shows comparison result only | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space) component props | `object` | - | Pass-through Space props | - |

### Comparison Rules
- **Unchanged**: When history and current values are equal, no comparison tags shown
- **Removed values**: Displayed as red strikethrough tags
- **Added values**: In read-only mode (`readOnly=true`), displayed as green success tags
- **Empty values**: Displayed as orange warning tags
- **Type mismatch**: When history and current value types differ, shows "Data type mismatch before and after edit"

### onChange Compatibility

CompareEdit automatically extracts pure value from onChange parameters, compatible with different antd component onChange signatures:

| Component Type | onChange Signature | Extraction Method |
| --- | --- | --- |
| Input / Input.TextArea | `(event)` | Automatically extracts `event.target.value` |
| Select / DatePicker / InputNumber | `(value, ...)` | Uses first parameter directly |
| Checkbox (single) | `(event)` | Automatically infers `event.target.checked` |
| Switch | `(checked, event)` | Uses first parameter directly |
| Checkbox.Group / Radio.Group | `(checkedValues)` / `(event)` | Uses first parameter directly / extracts `event.target.value` |

**Auto inference**: For `Checkbox`, detects `event.target.type === "checkbox"` to extract `event.target.checked` automatically; no manual config needed. Based on native DOM properties, stable in dev and production.

**Custom extraction**: For non-standard components, use `getValueFromEvent` for custom extraction logic.

### valuePropName Usage

`valuePropName` determines two things:
1. **Prop name for injecting value into child** (e.g. `value` or `checked`)
2. **Which field to extract from onChange event** (e.g. `event.target.value` or `event.target.checked`)

> Note: Configure `valuePropName` only on CompareEdit; keep `Form.Item` default (`valuePropName="value"`). CompareEdit always receives form value via `value` prop, then internally decides what prop to pass to the child based on `valuePropName`.

| Child Component | Config Required | Description |
| --- | --- | --- |
| Input / Select / DatePicker, etc. | No | Default `valuePropName="value"` works |
| Checkbox (single) | Recommended | Set `valuePropName="checked"` to pass `checked` prop; onChange extraction still works without config (auto inference) |
| Switch | Required | Set `valuePropName="checked"`, otherwise child receives `value` instead of `checked` |
| Radio (single) | Required | Set `valuePropName="checked"`, otherwise child receives `value` instead of `checked` |
| Radio.Group | No | Default `valuePropName="value"` works; Group receives `value` |
| Checkbox.Group | No | Default `valuePropName="value"` works; Group receives `value` |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Checkbox, Divider, Form, Input, Radio, Switch } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { CompareEdit, RestSelect } } = antdRestful;

export default () => {
  const [mode, setMode] = useState('edit');
  const [form] = Form.useForm();

  const readOnly = mode === 'readOnly';
  const disabled = mode === 'disabled';

  const options = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
    { value: 4, label: 'Option 4' },
  ];
  const groupOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
    { label: 'Option D', value: 'd' },
  ];

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="readOnly">Read-only</Radio.Button>
        <Radio.Button value="disabled">Disabled</Radio.Button>
      </Radio.Group>

      <Form form={form} layout="horizontal" labelCol={{ flex: '180px' }} initialValues={{ single: 1, multi: [1, 3], text: 'new value', nullable: null, checked: true, switched: true, group: ['b', 'c'], radio: 'a' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>Basic Comparison (Select)</Divider>
        <Form.Item label="Single value (single)" name="single" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={2} fieldValue="value" options={options} readOnly={readOnly} disabled={disabled}>
            <RestSelect style={{ width: 320 }} options={options} />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Multi value (multi)" name="multi" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={[1, 2]} fieldValue="value" options={options} readOnly={readOnly} disabled={disabled}>
            <RestSelect style={{ width: 320 }} mode="multiple" options={options} />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Text Comparison (Input)</Divider>
        <Form.Item label="Text value (text)" name="text" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="old value" enableCopy readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: 320 }} placeholder="Enter text and view comparison" />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Nullable value (nullable)" name="nullable" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="some value" emptyLabel="No data" readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: 320 }} placeholder="Clear to see empty value tag effect" />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Checkbox / Switch / Radio</Divider>
        <Form.Item label="Checkbox (checked)" name="checked" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={false} valuePropName="checked" readOnly={readOnly} disabled={disabled}>
            <Checkbox>Enable feature</Checkbox>
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Switch (switched)" name="switched" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={false} valuePropName="checked" readOnly={readOnly} disabled={disabled}>
            <Switch />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Radio.Group (radio)" name="radio" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="b" options={groupOptions} readOnly={readOnly} disabled={disabled}>
            <Radio.Group options={groupOptions} />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Checkbox.Group (group)" name="group" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={['a', 'b']} options={groupOptions} readOnly={readOnly} disabled={disabled}>
            <Checkbox.Group options={groupOptions} />
          </CompareEdit>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Notes
1. **children component**: Must pass an editable component as child supporting `value` (or `checked`) and `onChange`
2. **valuePropName config**: For single Checkbox, Switch, Radio, set `valuePropName="checked"` on **CompareEdit**. Do **not** set `valuePropName="checked"` on `Form.Item`, as CompareEdit always receives form value via `value` prop
3. **Radio.Group / Checkbox.Group**: Use `value` prop (default); no extra `valuePropName` config needed
4. **Data type consistency**: History and current values must have same type for effective comparison
5. **options config**: When value is primitive, provide options array to format display labels
6. **fieldValue**: Specifies field name to get value from options; default `'value'`
7. **Copy**: When enabled, each tag shows copy button to copy corresponding value
8. **getValueFromEvent**: Highest priority; when provided, fully overrides default value extraction for non-standard component adaptation
