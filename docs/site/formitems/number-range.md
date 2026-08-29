---
title: NumberRange
order: 10
---

## NumberRange
A closed-interval number range input built on Ant Design InputNumber, supporting various input formats. Suitable for price ranges, age ranges, and similar scenarios.

**Features:**
- Closed-interval number range input
- Multiple input formats (array, string, single number)
- Read-only display
- Custom display template
- Separate start and end input configuration

### Props
| <div style="width: 18ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Space.Compact `style` | - |
| className | Custom class name | `string` | - | Pass-through Space.Compact `className` | - |
| value | Current value; supports array, string, number formats | `array \| string \| number` | - | - | - |
| onChange | Callback when value changes | `function(value)` | - | - | - |
| **Data Config** | | | | | |
| defaultEmptyValue | Default value when a single input is empty | `undefined\|null\|''` | `null` | - | 0.2.0 |
| labelTemplate | Read-only display template; {0} is startValue, {1} is endValue | `string` | `'[{0},{1}]'` | - | - |
| **State Control** | | | | | |
| disabled | Whether disabled | `boolean` | `false` | Pass-through InputNumber `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdSpaceProps | Native props for Ant Design [Space.Compact](https://ant.design/components/space) | `object` | - | Pass-through Space.Compact props | - |
| antdInputProps | Shared props for both InputNumber components | `object` | - | Pass-through InputNumber props; `value` / `onChange` / `disabled` managed internally | - |
| antdStartProps | Props specific to start InputNumber | `object` | - | Pass-through InputNumber props; higher priority than antdInputProps | - |
| antdEndProps | Props specific to end InputNumber | `object` | - | Pass-through InputNumber props; higher priority than antdInputProps | - |

### Value Format Support
The component supports multiple input value formats:

1. **Array format**: `[startValue, endValue]`
2. **String format**: `"startValue,endValue"`
3. **Single number**: `startValue` (endValue is `defaultEmptyValue`, default `null`)
4. **Empty value**: `null`, `undefined`, `[]`

### Output Format
- **With value**: Returns `[startValue, endValue]` array format
- **Without value**: Returns `null`

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { NumberRange } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  const [mode, setMode] = useState('edit');
  const [basicRange, setBasicRange] = useState();
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [ageRange, setAgeRange] = useState();
  const [stepRange, setStepRange] = useState();

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Basic Number Range</Divider>
        <Form.Item label="Number range" style={{ marginBottom: 8 }}>
          <NumberRange
            value={basicRange}
            onChange={setBasicRange}
            readOnly={readOnly}
            disabled={disabled}
            antdStartProps={{ placeholder: 'Min' }}
            antdEndProps={{ placeholder: 'Max' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(basicRange ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Price Range (Currency Format)</Divider>
        <Form.Item label="Price range" style={{ marginBottom: 8 }}>
          <NumberRange
            value={priceRange}
            onChange={setPriceRange}
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{
              min: 0,
              precision: 2,
              formatter: (value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              parser: (value) => value.replace(/¥\s?|(,*)/g, ''),
            }}
            antdStartProps={{ placeholder: 'Min price' }}
            antdEndProps={{ placeholder: 'Max price' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(priceRange)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Age Range (Integer Only)</Divider>
        <Form.Item label="Age range" style={{ marginBottom: 8 }}>
          <NumberRange
            value={ageRange}
            onChange={setAgeRange}
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ min: 0, max: 120, precision: 0 }}
            antdStartProps={{ placeholder: 'Min age' }}
            antdEndProps={{ placeholder: 'Max age' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(ageRange ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 4: Step Input</Divider>
        <Form.Item label="Number range" style={{ marginBottom: 8 }}>
          <NumberRange
            value={stepRange}
            onChange={setStepRange}
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ step: 10, min: 0, max: 1000 }}
            antdStartProps={{ placeholder: 'Start value' }}
            antdEndProps={{ placeholder: 'End value' }}
          />
          <div style={valueStyle}>Form value: {JSON.stringify(stepRange ?? null)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Advanced Usage

#### Form Validation Integration
```jsx
import React from 'react';
import { Form, Button } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { NumberRange } } = antdRestful;

export default () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="priceRange"
        label="Price range"
        rules={[
          {
            validator: (_, value) => {
              if (!value || value.length !== 2) {
                return Promise.reject(new Error('Please enter a complete price range'));
              }
              const [min, max] = value;
              if (min >= max) {
                return Promise.reject(new Error('Min must be less than max'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <NumberRange
          antdInputProps={{
            min: 0,
            precision: 2,
          }}
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

#### Controlled Component Example
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { NumberRange } } = antdRestful;

export default () => {
  const [range, setRange] = useState([0, 100]);

  const handleRangeChange = (value) => {
    if (value && value.length === 2) {
      const [min, max] = value;
      // Ensure min does not exceed max
      if (min <= max) {
        setRange(value);
      }
    } else {
      setRange(value);
    }
  };

  return (
    <div>
      <NumberRange
        value={range}
        onChange={handleRangeChange}
        antdStartProps={{ placeholder: 'Min' }}
        antdEndProps={{ placeholder: 'Max' }}
      />
      <p>Current range: {range ? `${range[0]} ~ ${range[1]}` : 'Not set'}</p>
    </div>
  );
};
```

### Template Syntax
`labelTemplate` supports placeholder syntax:
- `{0}` - Start value (startValue)
- `{1}` - End value (endValue)

Example templates:
- `"[{0},{1}]"` - Default format, displays as "[10,100]"
- `"{0} ~ {1}"` - Displays as "10 ~ 100"
- `"Range: {0} to {1}"` - Displays as "Range: 10 to 100"

### Data Processing Logic
1. **Input processing**:
   - Array format used directly
   - String format split by comma
   - Single number converted to `[value, defaultEmptyValue]` (default `[value, null]`)
   - Empty value converted to `[undefined, undefined]`

2. **Output processing**:
   - Returns `undefined` when both values are empty
   - Otherwise returns `[startValue, endValue]` array

### Notes
1. **Closed interval**: Component implements closed interval including boundary values
2. **Value format**: Supports multiple input formats, normalized to array format internally
3. **Callback parameters**: onChange returns `[startValue, endValue]` format or `undefined`
4. **Read-only display**: Uses `labelTemplate` for formatted display in read-only mode
5. **Property inheritance**: `antdInputProps` applies to both inputs; `antdStartProps` and `antdEndProps` configure each separately
6. **Value validation**: Recommend ensuring min < max in form validation
7. **Precision control**: Control decimal places via `precision` property
8. **Range limits**: Limit input range via `min` and `max` properties

### Related Components
- [RangeStrPicker](./range-str-picker.md) - Date time range picker
- [GridForm](../components/grid-form.md) - Grid form supporting NumberRange as a form field type
- [DateStrPicker](./date-str-picker.md) - Date time picker
