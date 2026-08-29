---
title: RangeStrPicker
order: 8
---

## RangeStrPicker
A string-format date range picker based on Ant Design DatePicker.RangePicker/TimePicker.RangePicker. Values are input and output as strings.

**Features:**
- Date and time range selection
- String or string array value handling
- Custom date format
- Read-only display
- Automatic conversion between strings and dayjs objects

### Props
| <div style="width: 18ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through RangePicker `style` | - |
| className | Custom class name | `string` | - | Pass-through RangePicker `className` | - |
| value | Currently selected date range (string or string array) | `string \| array<string>` | - | Overrides RangePicker `value`; internal string/dayjs conversion | - |
| onChange | Callback when value changes | `function(dateStrings, dates)` | - | Overrides RangePicker `onChange`; outputs string format | - |
| **Date Config** | | | | | |
| defaultEmptyValue | Default value when a single input is empty | `undefined\|null\|''` | `null` | - | 0.2.0 |
| defaultValue | Default date range (string or string array) | `string \| array<string>` | - | Overrides RangePicker `defaultValue`; converted to dayjs internally | - |
| format | Date format | `string` | - | Pass-through RangePicker `format` | - |
| isTime | Whether to use time picker | `boolean` | `false` | - | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through RangePicker `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdRangePickerProps | Native props for Ant Design [RangePicker](https://ant.design/components/date-picker) | `object` | - | Pass-through RangePicker props; `value` / `onChange` / `defaultValue` managed internally | - |

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RangeStrPicker } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [dateRange, setDateRange] = useState([]);
  const [timeRange, setTimeRange] = useState([]);
  const [datetimeRange, setDatetimeRange] = useState([]);

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Date Range</Divider>
        <Form.Item label="Date range" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={dateRange}
            onChange={setDateRange}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(dateRange)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Time Range</Divider>
        <Form.Item label="Time range" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={timeRange}
            onChange={setTimeRange}
            readOnly={readOnly}
            disabled={disabled}
            isTime
            format="HH:mm:ss"
            placeholder={['Start time', 'End time']}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(timeRange)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Date Time Range</Divider>
        <Form.Item label="Date time" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={datetimeRange}
            onChange={setDatetimeRange}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD HH:mm:ss"
            antdRangePickerProps={{ showTime: true }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(datetimeRange)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Value Format Support
The component supports multiple input value formats:
1. **String array**: `['2023-01-01', '2023-12-31']`
2. **Comma-separated string**: `'2023-01-01,2023-12-31'`
3. **Empty value**: `null`, `undefined`, `[]`

### Advanced Usage

#### Comma-Separated String Value
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RangeStrPicker } } = antdRestful;

export default () => {
  const [value, setValue] = useState('2024-01-01,2024-01-31');

  const normalize = (nextValue) => {
    if (Array.isArray(nextValue)) return nextValue.join(',');
    return nextValue || '';
  };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <RangeStrPicker
        style={{ width: 380 }}
        value={value}
        onChange={(nextValue) => setValue(normalize(nextValue))}
        format="YYYY-MM-DD"
      />
      <div>Form value: {value}</div>
    </div>
  );
};
```

#### defaultValue and defaultEmptyValue
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RangeStrPicker } } = antdRestful;

export default () => {
  const defaultRange = ['2024-02-01', '2024-02-29'];
  const [value, setValue] = useState(undefined);
  const [displayValue, setDisplayValue] = useState(defaultRange);

  const handleChange = (nextValue) => {
    setValue(nextValue);
    setDisplayValue(nextValue || null);
  };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <RangeStrPicker
        style={{ width: 380 }}
        value={value}
        onChange={handleChange}
        format="YYYY-MM-DD"
        defaultValue={defaultRange}
        defaultEmptyValue=""
      />
      <div>Form value: {JSON.stringify(displayValue)}</div>
    </div>
  );
};
```

### Output Format
- **With value**: Returns string array `[startDate, endDate]`
- **Without value**: Returns `undefined`

### Notes
1. **String format**: Component specifically handles string-format date range values
2. **Format conversion**: Automatically converts between strings and dayjs objects
3. **Callback parameters**: onChange provides date string array and date object array
4. **Read-only mode**: Displays date range separated by " ~ "
5. **Time mode**: Use time range picker via `isTime` parameter

### Related Components
- [DateStrPicker](./date-str-picker.md) - Single date time picker
- [NumberRange](./number-range.md) - Number range picker
- [GridForm](../components/grid-form.md) - Grid form supporting RangeStrPicker as a form field type
