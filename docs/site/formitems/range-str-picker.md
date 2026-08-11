---
title: RangeStrPicker
order: 8
---

## RangeStrPicker
基于 Ant Design DatePicker.RangePicker/TimePicker.RangePicker 的字符串日期范围选择器，值以字符串格式输入输出。

**功能特性：**
- 支持日期和时间范围选择
- 值以字符串或字符串数组格式处理
- 支持自定义日期格式
- 支持只读模式展示
- 自动处理字符串与 dayjs 对象的转换

### 参数说明
| <div style="width: 18ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 RangePicker `style` | - |
| className | 自定义类名 | `string` | - | 透传 RangePicker `className` | - |
| value | 当前选中的日期范围（字符串或字符串数组） | `string \| array<string>` | - | 覆盖 RangePicker `value`，内部处理字符串与 dayjs 转换 | - |
| onChange | 值变化时的回调函数 | `function(dateStrings, dates)` | - | 覆盖 RangePicker `onChange`，输出字符串格式 | - |
| **日期配置** | | | | | |
| defaultEmptyValue | 单个输入框为空时的默认值 | `undefined\|null\|''` | `null` | - | 0.2.0 |
| defaultValue | 默认日期范围（字符串或字符串数组） | `string \| array<string>` | - | 覆盖 RangePicker `defaultValue`，内部转换为 dayjs | - |
| format | 日期格式 | `string` | - | 透传 RangePicker `format` | - |
| isTime | 是否为时间选择器 | `boolean` | `false` | - | - |
| **状态控制** | | | | | |
| disabled | 是否禁用 | `boolean` | `false` | 透传 RangePicker `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdRangePickerProps | Ant Design [RangePicker](https://ant.design/components/date-picker-cn) 组件的原生属性 | `object` | - | 透传 RangePicker 属性，`value` / `onChange` / `defaultValue` 由内部管理 | - |

### 使用示例

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
        <Radio.Button value="edit">编辑</Radio.Button>
        <Radio.Button value="readOnly">只读</Radio.Button>
        <Radio.Button value="disabled">禁用</Radio.Button>
      </Radio.Group>

      <Form layout="horizontal" labelCol={{ flex: '100px' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>场景1：日期范围</Divider>
        <Form.Item label="日期范围" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={dateRange}
            onChange={setDateRange}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
          />
          <div style={valueStyle}>表单value值：{JSON.stringify(dateRange)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>场景2：时间范围</Divider>
        <Form.Item label="时间范围" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={timeRange}
            onChange={setTimeRange}
            readOnly={readOnly}
            disabled={disabled}
            isTime
            format="HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
          />
          <div style={valueStyle}>表单value值：{JSON.stringify(timeRange)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>场景3：日期时间范围</Divider>
        <Form.Item label="日期时间" style={{ marginBottom: 8 }}>
          <RangeStrPicker
            style={{ width: 380 }}
            value={datetimeRange}
            onChange={setDatetimeRange}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD HH:mm:ss"
            antdRangePickerProps={{ showTime: true }}
          />
          <div style={valueStyle}>表单value值：{JSON.stringify(datetimeRange)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### 值格式支持
组件支持多种输入值格式：
1. **字符串数组**：`['2023-01-01', '2023-12-31']`
2. **逗号分隔字符串**：`'2023-01-01,2023-12-31'`
3. **空值**：`null`、`undefined`、`[]`

### 高级用法

#### 逗号分隔字符串值
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
      <div>表单value值：{value}</div>
    </div>
  );
};
```

#### defaultValue 与 defaultEmptyValue
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
      <div>表单value值：{JSON.stringify(displayValue)}</div>
    </div>
  );
};
```

### 输出格式
- **有值时**：返回字符串数组 `[startDate, endDate]`
- **无值时**：返回 `undefined`

### 注意事项
1. **字符串格式**：组件专门处理字符串格式的日期范围值
2. **格式转换**：自动处理字符串与 dayjs 对象之间的转换
3. **回调参数**：onChange 提供日期字符串数组和日期对象数组两个参数
4. **只读模式**：只读时以 " ~ " 分隔显示日期范围
5. **时间模式**：通过 `isTime` 参数选择使用时间范围选择器

### 相关组件
- [DateStrPicker](./DateStrPicker.md) - 单个日期时间选择器
- [NumberRange](./NumberRange.md) - 数字范围选择器
- [GridForm](../GridForm.md) - 网格表单，支持 RangeStrPicker 作为表单字段类型
