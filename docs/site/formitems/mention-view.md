---
title: MentionView
order: 12
---

## MentionView
基于 Ant Design Mentions 组件扩展的远程提及输入器，支持远程数据搜索、自定义字段映射等功能。

**功能特性：**
- 支持远程数据搜索
- 支持 @ 提及功能
- 支持自定义字段映射
- 支持搜索防抖处理
- 支持只读模式展示
- 支持自定义标签模板

### 参数说明
| <div style="width: 18ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 Mentions `style` | - |
| className | 自定义类名 | `string` | - | 透传 Mentions `className` | - |
| value | 当前输入的值 | `string` | - | 透传 Mentions `value` | - |
| onChange | 值变化时的回调函数 | `function(value)` | - | 透传 Mentions `onChange` | - |
| **远程数据相关** | | | | | |
| restful | 远程数据接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| baseParams | 基础请求参数 | `object` | - | - | - |
| searchKey | 搜索关键字参数名 | `string` | `'search'` | - | - |
| searchMinEnter | 最少输入字符数 | `number` | `0` | - | - |
| parseRowsPath | 解析接口返回数据的路径 | `string` | `'results'` | - | - |
| **扩展配置** | | | | | |
| fieldNames | 字段名称映射配置 | `object` | - | - | - |
| labelTemplate | 远程接口返回数据的 label 模板 | `string` | - | - | - |
| inValue | 是否在值中包含提及信息 | `boolean` | `false` | - | - |
| **状态控制** | | | | | |
| disabled | 是否禁用 | `boolean` | `false` | 透传 Mentions `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdMentionsProps | Ant Design [Mentions](https://ant.design/components/mentions-cn) 组件原生属性 | `object` | - | 透传 Mentions 属性，`value` / `onChange` / `onSearch` / `options` / `loading` 由内部管理 | - |

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { MentionView } } = antdRestful;

export default () => {
  const [basicValue, setBasicValue] = useState('');
  const [inValueData, setInValueData] = useState({ value: '', mentions: [] });

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <MentionView
        style={{ width: 360 }}
        restful="https://dummyjson.com/users/search"
        parseRowsPath="users"
        value={basicValue}
        onChange={setBasicValue}
        searchKey="q"
        fieldNames={{ value: 'username', label: 'firstName' }}
        labelTemplate="{firstName} (@{username})"
        antdMentionsProps={{ style: { width: 360 }, rows: 3, placeholder: '输入 @ 提及用户' }}
      />
      <div>当前输入值：{basicValue || '-'}</div>

      <MentionView
        style={{ width: 360 }}
        restful="https://dummyjson.com/users/search"
        parseRowsPath="users"
        value={inValueData.value}
        onChange={setInValueData}
        inValue
        searchKey="q"
        searchMinEnter={1}
        fieldNames={{ value: 'username', label: 'firstName' }}
        labelTemplate="{firstName} (@{username})"
        antdMentionsProps={{ style: { width: 360 }, rows: 3, placeholder: '输入 @ 查看 mentions 结构' }}
      />
      <div>当前 mentions：{JSON.stringify(inValueData.mentions || [])}</div>

      <MentionView style={{ width: 360 }} value="Hello @张三, 请查看这个任务" readOnly />
    </div>
  );
};
```

### 字段映射配置 (fieldNames)
```javascript
{
  value: 'username',  // 提及值字段名
  label: 'firstName'  // 显示标签字段名
}
```

### 字段映射建议
- `value` 建议映射为你希望真正插入到文本中的字段（常用 `username`）。
- `label` 建议映射为下拉面板里更友好的显示字段（常用 `firstName` / `name`）。
- 若接口返回 `id/title` 结构，可改为：
```javascript
fieldNames={{ value: 'title', label: 'title' }}
```

### 注意事项
1. **搜索防抖**：组件内置 200ms 的搜索防抖机制
2. **字段映射**：`fieldNames` 用于映射 API 返回数据的字段名
3. **标签模板**：`labelTemplate` 支持使用 `{fieldName}` 语法自定义显示格式
4. **提及信息**：启用 `inValue` 后，onChange 返回包含 mentions 数组的对象
5. **只读模式**：只读时直接显示文本内容

### 相关组件
- [RestSelect](./RestSelect.md) - 远程下拉选择器
- [RestAutoComplete](./RestAutoComplete.md) - 远程自动完成
- [TableSelect](./TableSelect.md) - 表格选择器
- [GridForm](../GridForm.md) - 网格表单，支持 MentionView 作为自定义字段
