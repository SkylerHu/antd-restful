---
title: CompareEdit
order: 11
---

## CompareEdit
一个支持历史值对比的编辑组件，可以显示当前值与历史值的差异，适用于需要对比修改前后数据的场景。

**功能特性：**
- 支持历史值与当前值的可视化对比
- 支持多种数据类型的比较（基础类型、数组、对象）
- 支持只读模式、编辑模式和禁用模式
- 支持复制功能
- 支持自定义标签模板和空值显示
- 自动兼容 antd 原生组件的 onChange 差异（Input、Checkbox、Switch 等）
- 基于 Ant Design Space 和 Tag 组件实现

### 参数说明
| <div style="width: 18ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| children | 子组件，用于编辑当前值 | `ReactNode` | - | - | - |
| style | 自定义样式 | `object` | - | - | - |
| className | 自定义类名 | `string` | - | - | - |
| **数据与对比** | | | | | |
| value | 当前选中的值 | `any` | - | - | - |
| onChange | 值变化时的回调函数 | `function(val, ...args)` | - | - | - |
| historyValue | 历史值，用于与当前值进行对比 | `any` | - | - | - |
| labelTemplate | 格式化显示模板，必须是唯一的，能够观察出来区别 | `string` | - | - | - |
| fieldValue | 从 options 中获取 value 的字段名 | `string` | `'value'` | - | - |
| options | 当 value 是基础类型时，options 用于格式化 label | `array` | - | - | - |
| emptyLabel | 空值显示标签 | `string` | `'(空)'` | - | - |
| getValueFromEvent | 自定义从 onChange 事件中提取 value 的方式，优先级最高 | `(...args) => any` | - | - | - |
| valuePropName | 子组件值的属性名，用于从 event.target 中提取值 | `string` | `'value'` | - | - |
| **交互控制** | | | | | |
| enableCopy | 是否启用复制功能 | `boolean` | `false` | - | - |
| disabled | 是否禁用编辑功能 | `boolean` | `false` | - | - |
| readOnly | 是否只读模式，只读时只显示对比结果 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的属性 | `object` | - | 透传 Space 属性 | - |

### 对比规则
- **未修改**：当历史值与当前值完全相等时，不显示任何对比标签
- **删除的值**：显示为红色删除线样式的标签
- **新增的值**：在只读模式（`readOnly=true`）下显示为绿色成功样式的标签
- **空值处理**：空值显示为橙色警告样式的标签
- **类型不一致**：当历史值与当前值类型不一致时，显示"修改前后数据类型不一致"

### onChange 兼容说明

CompareEdit 内部会自动从 onChange 的参数中提取纯净的 value 值，兼容不同 antd 组件的 onChange 签名差异：

| 组件类型 | onChange 签名 | 提取方式 |
| --- | --- | --- |
| Input / Input.TextArea | `(event)` | 自动提取 `event.target.value` |
| Select / DatePicker / InputNumber | `(value, ...)` | 直接使用第一个参数 |
| Checkbox (单个) | `(event)` | 自动推断提取 `event.target.checked` |
| Switch | `(checked, event)` | 直接使用第一个参数 |
| Checkbox.Group / Radio.Group | `(checkedValues)` / `(event)` | 直接使用第一个参数 / 提取 `event.target.value` |

**自动推断**：对于 `Checkbox` 组件，会通过检测 `event.target.type === "checkbox"` 自动提取 `event.target.checked`，无需手动配置。该判断基于 DOM 原生属性，在开发和生产环境均稳定可用。

**自定义提取**：对于非标准组件，可通过 `getValueFromEvent` 自定义提取逻辑。

### valuePropName 使用说明

`valuePropName` 决定两件事：
1. **注入子组件时用什么属性名传值**（如 `value` 或 `checked`）
2. **从 onChange 事件中取哪个字段**（如 `event.target.value` 或 `event.target.checked`）

> 注意：`valuePropName` 只配置在 CompareEdit 上，`Form.Item` 保持默认（`valuePropName="value"`）。因为 CompareEdit 本身始终通过 `value` prop 接收表单值，再由它内部根据 `valuePropName` 决定传什么属性给子组件。

| 子组件 | 是否需要配置 | 说明 |
| --- | --- | --- |
| Input / Select / DatePicker 等 | 不需要 | 默认 `valuePropName="value"` 即可 |
| Checkbox（单个） | 建议配置 | 设 `valuePropName="checked"` 确保传 `checked` prop；不配置时 onChange 值提取仍正确（自动推断） |
| Switch | 需要配置 | 设 `valuePropName="checked"`，否则子组件收到 `value` prop 而非 `checked` |
| Radio（单个） | 需要配置 | 设 `valuePropName="checked"`，否则子组件收到 `value` prop 而非 `checked` |
| Radio.Group | 不需要 | 默认 `valuePropName="value"` 即可，Group 本身接收 `value` |
| Checkbox.Group | 不需要 | 默认 `valuePropName="value"` 即可，Group 本身接收 `value` |

### 使用示例

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
    { value: 1, label: '选项1' },
    { value: 2, label: '选项2' },
    { value: 3, label: '选项3' },
    { value: 4, label: '选项4' },
  ];
  const groupOptions = [
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' },
    { label: '选项C', value: 'c' },
    { label: '选项D', value: 'd' },
  ];

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">编辑</Radio.Button>
        <Radio.Button value="readOnly">只读</Radio.Button>
        <Radio.Button value="disabled">禁用</Radio.Button>
      </Radio.Group>

      <Form form={form} layout="horizontal" labelCol={{ flex: '180px' }} initialValues={{ single: 1, multi: [1, 3], text: 'new value', nullable: null, checked: true, switched: true, group: ['b', 'c'], radio: 'a' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>基础对比（Select）</Divider>
        <Form.Item label="单选值 (single)" name="single" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={2} fieldValue="value" options={options} readOnly={readOnly} disabled={disabled}>
            <RestSelect style={{ width: 320 }} options={options} />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="多选值 (multi)" name="multi" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={[1, 2]} fieldValue="value" options={options} readOnly={readOnly} disabled={disabled}>
            <RestSelect style={{ width: 320 }} mode="multiple" options={options} />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>文本对比（Input）</Divider>
        <Form.Item label="文本值 (text)" name="text" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="old value" enableCopy readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: 320 }} placeholder="输入文本并查看对比" />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="可空值 (nullable)" name="nullable" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="some value" emptyLabel="无数据" readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: 320 }} placeholder="清空可查看空值标签效果" />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Checkbox / Switch / Radio</Divider>
        <Form.Item label="Checkbox (checked)" name="checked" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={false} valuePropName="checked" readOnly={readOnly} disabled={disabled}>
            <Checkbox>启用功能</Checkbox>
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

### 注意事项
1. **children 组件**：必须传入一个可编辑的组件作为子元素，该组件需要支持 `value`（或 `checked`）和 `onChange` 属性
2. **valuePropName 配置**：对于 Checkbox（单个）、Switch、Radio（单个），在 **CompareEdit** 上设置 `valuePropName="checked"`。注意 `Form.Item` 上**不要**设置 `valuePropName="checked"`，因为 CompareEdit 始终通过 `value` 属性接收表单值
3. **Radio.Group / Checkbox.Group**：使用 `value` 属性（默认），无需额外配置 `valuePropName`
4. **数据类型一致性**：历史值与当前值的数据类型必须一致才能进行有效对比
5. **options 配置**：当值为基础类型时，需要提供 options 数组来格式化显示标签
6. **fieldValue**：指定从 options 中获取 value 的字段名，默认为 `'value'`
7. **复制功能**：启用复制功能后，每个标签都会显示复制按钮，点击可复制对应的值
8. **getValueFromEvent**：优先级最高，当提供时完全覆盖默认的值提取逻辑，用于非标准组件的适配
