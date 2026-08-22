---
title: DateStrPicker
order: 7
---

## DateStrPicker
基于 Ant Design DatePicker/TimePicker 的字符串日期选择器，值以字符串格式输入输出，支持日期和时间选择。

**功能特性：**
- 支持日期和时间选择
- 值以字符串格式处理
- 支持自定义日期格式
- 支持只读模式展示
- 自动处理字符串与 dayjs 对象的转换

### 参数说明
| <div style="width: 17ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 DatePicker `style` | - |
| className | 自定义类名 | `string` | - | 透传 DatePicker `className` | - |
| value | 当前选中的日期字符串 | `string` | - | 覆盖 DatePicker `value`，内部处理字符串与 dayjs 转换 | - |
| onChange | 值变化时的回调函数 | `function(dateString, date)` | - | 覆盖 DatePicker `onChange`，输出字符串格式 | - |
| **日期配置** | | | | | |
| defaultValue | 默认日期字符串 | `string` | - | 覆盖 DatePicker `defaultValue`，内部转换为 dayjs | - |
| format | 日期格式 | `string` | - | 透传 DatePicker `format` | - |
| picker | 选择器类型 | `string` | `'date'` | 透传 DatePicker `picker` | - |
| **状态控制** | | | | | |
| disabled | 是否禁用 | `boolean` | `false` | 透传 DatePicker `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdPickerProps | Ant Design [DatePicker](https://ant.design/components/date-picker-cn)/[TimePicker](https://ant.design/components/time-picker-cn) 组件的原生属性 | `object` | - | 透传 DatePicker/TimePicker 属性，`value` / `onChange` / `defaultValue` 由内部管理 | - |

### 使用示例

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
        <Radio.Button value="edit">编辑</Radio.Button>
        <Radio.Button value="readOnly">只读</Radio.Button>
        <Radio.Button value="disabled">禁用</Radio.Button>
      </Radio.Group>

      <Form layout="horizontal" labelCol={{ flex: '100px' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>场景1：日期选择</Divider>
        <Form.Item label="日期" style={{ marginBottom: 8 }}>
          <DateStrPicker style={{ width: 320 }} value={date} onChange={setDate} readOnly={readOnly} disabled={disabled} format="YYYY-MM-DD" placeholder="请选择日期" />
          <div style={valueStyle}>表单value值：{date}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>场景2：时间选择</Divider>
        <Form.Item label="时间" style={{ marginBottom: 8 }}>
          <DateStrPicker style={{ width: 320 }} value={time} onChange={setTime} readOnly={readOnly} disabled={disabled} picker="time" format="HH:mm:ss" placeholder="请选择时间" />
          <div style={valueStyle}>表单value值：{time}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>场景3：日期时间选择</Divider>
        <Form.Item label="日期时间" style={{ marginBottom: 8 }}>
          <DateStrPicker
            style={{ width: 320 }}
            value={datetime}
            onChange={setDatetime}
            readOnly={readOnly}
            disabled={disabled}
            format="YYYY-MM-DD HH:mm:ss"
            antdPickerProps={{ showTime: true }}
          />
          <div style={valueStyle}>表单value值：{datetime}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### picker 类型
- `'date'` - 日期选择器（默认）
- `'time'` - 时间选择器
- `'week'` - 周选择器
- `'month'` - 月选择器
- `'quarter'` - 季度选择器
- `'year'` - 年选择器

### 注意事项
1. **字符串格式**：组件专门处理字符串格式的日期值
2. **格式转换**：自动处理字符串与 dayjs 对象之间的转换
3. **回调参数**：onChange 提供日期字符串和日期对象两个参数
4. **只读模式**：只读时直接显示日期字符串
5. **picker 类型**：根据 `picker` 参数选择使用 DatePicker 或 TimePicker

### 相关组件
- [RangeStrPicker](./RangeStrPicker.md) - 日期时间范围选择器
- [GridForm](../GridForm.md) - 网格表单，支持 DateStrPicker 作为表单字段类型
