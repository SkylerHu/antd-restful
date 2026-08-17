---
title: DateStrPicker
order: 7
---

## DateStrPicker
A string-format date picker based on Ant Design DatePicker/TimePicker. Values are input and output as strings, supporting date and time selection.

**Features:**
- Date and time selection
- String-format value handling
- Custom date format
- Read-only display
- Automatic conversion between strings and dayjs objects

### Props
| <div style="width: 17ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through DatePicker `style` | - |
| className | Custom class name | `string` | - | Pass-through DatePicker `className` | - |
| value | Currently selected date string | `string` | - | Overrides DatePicker `value`; internal string/dayjs conversion | - |
| onChange | Callback when value changes | `function(dateString, date)` | - | Overrides DatePicker `onChange`; outputs string format | - |
| **Date Config** | | | | | |
| defaultValue | Default date string | `string` | - | Overrides DatePicker `defaultValue`; converted to dayjs internally | - |
| format | Date format | `string` | - | Pass-through DatePicker `format` | - |
| picker | Picker type | `string` | `'date'` | Pass-through DatePicker `picker` | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through DatePicker `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdPickerProps | Native props for Ant Design [DatePicker](https://ant.design/components/date-picker)/[TimePicker](https://ant.design/components/time-picker) | `object` | - | Pass-through DatePicker/TimePicker props; `value` / `onChange` / `defaultValue` managed internally | - |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { DateStrPicker } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [datetime, setDatetime] = useState('');

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Date Selection</Divider>
        <Form.Item label="Date" style={{ marginBottom: 8 }}>
          <DateStrPicker style={{ width: 320 }} value={date} onChange={setDate} readOnly={readOnly} disabled={disabled} format="YYYY-MM-DD" placeholder="Select date" />
          <div style={valueStyle}>Form value: {date}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Time Selection</Divider>
        <Form.Item label="Time" style={{ marginBottom: 8 }}>
          <DateStrPicker style={{ width: 320 }} value={time} onChange={setTime} readOnly={readOnly} disabled={disabled} picker="time" format="HH:mm:ss" placeholder="Select time" />
          <div style={valueStyle}>Form value: {time}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Date Time Selection</Divider>
        <Form.Item label="Date time" style={{ marginBottom: 8 }}>
          <DateStrPicker
            style={{ width: 320 }}
            value={datetime}
            onChange={setDatetime}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD HH:mm:ss"
            antdPickerProps={{ showTime: true }}
          />
          <div style={valueStyle}>Form value: {datetime}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### picker Types
- `'date'` - Date picker (default)
- `'time'` - Time picker
- `'week'` - Week picker
- `'month'` - Month picker
- `'quarter'` - Quarter picker
- `'year'` - Year picker

### Notes
1. **String format**: Component specifically handles string-format date values
2. **Format conversion**: Automatically converts between strings and dayjs objects
3. **Callback parameters**: onChange provides date string and date object
4. **Read-only mode**: Displays date string directly
5. **picker type**: Uses DatePicker or TimePicker based on `picker` parameter

### Related Components
- [RangeStrPicker](./RangeStrPicker.md) - Date time range picker
- [GridForm](../GridForm.md) - Grid form supporting DateStrPicker as a form field type
