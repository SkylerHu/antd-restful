---
title: CompareEdit
order: 11
---

## CompareEdit
一个支持历史值对比的编辑组件，可以显示当前值与历史值的差异，适用于需要对比修改前后数据的场景。

**功能特性：**
- 支持历史值与当前值的可视化对比
- 支持多种数据类型的比较（基础类型、数组、对象）
- 支持只读模式和编辑模式
- 支持复制功能
- 支持自定义标签模板和空值显示
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

### 使用示例

```jsx
import React, { useState } from 'react';
import { Input } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { CompareEdit, RestSelect } } = antdRestful;

export default () => {
  const [basicValue, setBasicValue] = useState(1);
  const [arrayValue, setArrayValue] = useState([1, 3]);
  const [textValue, setTextValue] = useState('new value');
  const [nullableValue, setNullableValue] = useState(null);
  const options = [
    { value: 1, label: '选项1' },
    { value: 2, label: '选项2' },
    { value: 3, label: '选项3' },
    { value: 4, label: '选项4' },
  ];

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div>场景1：基础值对比（单选）</div>
      <CompareEdit
        value={basicValue}
        historyValue={2}
        fieldValue="value"
        options={options}
        onChange={setBasicValue}
      >
        <RestSelect style={{ width: 320 }} options={options} />
      </CompareEdit>
      <div>基础值：{JSON.stringify(basicValue)}</div>

      <div>场景2：数组值对比（多选）</div>
      <CompareEdit
        value={arrayValue}
        historyValue={[1, 2]}
        fieldValue="value"
        options={options}
        onChange={setArrayValue}
      >
        <RestSelect style={{ width: 320 }} mode="multiple" options={options} />
      </CompareEdit>
      <div>数组值：{JSON.stringify(arrayValue)}</div>

      <div>场景3：文本对比 + 复制</div>
      <CompareEdit value={textValue} historyValue="old value" enableCopy onChange={setTextValue}>
        <Input style={{ width: 320 }} placeholder="输入文本并查看对比" />
      </CompareEdit>
      <div>文本值：{textValue || '-'}</div>

      <div>场景4：空值标签展示</div>
      <CompareEdit value={nullableValue} historyValue="some value" emptyLabel="无数据" onChange={setNullableValue}>
        <Input style={{ width: 320 }} placeholder="清空可查看空值标签效果" />
      </CompareEdit>
      <div>空值示例：{nullableValue || '(空)'}</div>

      <div>场景5：只读模式（含复制）</div>
      <CompareEdit value={[1, 3]} historyValue={[1, 2]} fieldValue="value" options={options} readOnly enableCopy>
        <RestSelect style={{ width: 320 }} mode="multiple" options={options} />
      </CompareEdit>
    </div>
  );
};
```

### 注意事项
1. **children 组件**：必须传入一个可编辑的组件作为子元素，该组件需要支持 `value` 和 `onChange` 属性
2. **数据类型一致性**：历史值与当前值的数据类型必须一致才能进行有效对比
3. **options 配置**：当值为基础类型时，需要提供 options 数组来格式化显示标签
4. **fieldValue**：指定从 options 中获取 value 的字段名，默认为 'value'
5. **复制功能**：启用复制功能后，每个标签都会显示复制按钮，点击可复制对应的值
