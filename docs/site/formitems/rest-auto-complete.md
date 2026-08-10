---
title: RestAutoComplete
order: 3
---

## RestAutoComplete
基于 Ant Design AutoComplete 组件扩展的远程自动完成输入框，支持远程数据搜索、自定义字段映射等功能。

**功能特性：**
- 支持远程数据搜索
- 支持搜索防抖处理
- 支持自定义字段名映射
- 支持自定义标签模板
- 支持只读模式展示
- 支持搜索最小字符数限制

### 参数说明
| <div style="width: 20ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 AutoComplete `style` | - |
| className | 自定义类名 | `string` | - | 透传 AutoComplete `className` | - |
| value | 当前选中的值 | `any` | - | 透传 AutoComplete `value` | - |
| onChange | 值变化时的回调函数 | `function(value)` | - | 透传 AutoComplete `onChange` | - |
| **远程数据相关** | | | | | |
| restful | 远程数据接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| baseParams | 接口筛选条件 | `object` | - | - | - |
| searchKey | 搜索关键字参数名 | `string` | `'search'` | - | - |
| searchMinEnter | 最少输入字符数 | `number` | `1` | - | - |
| parseRowsPath | 解析接口返回数据的路径 | `string` | `'results'` | - | - |
| **显示和交互** | | | | | |
| options | 选项列表 | `array` | - | 覆盖 AutoComplete `options`，远程模式由内部管理 | - |
| fieldNames | 字段名称映射配置（原生组件并不支持如此配置） | `object` | - | - | - |
| labelTemplate | 远程接口返回数据的 label 模板 | `string` | - | - | - |
| **状态控制** | | | | | |
| disabled | 是否禁用 | `boolean` | `false` | 透传 AutoComplete `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdAutoCompleteProps | Ant Design [AutoComplete](https://ant.design/components/auto-complete-cn) 组件原生属性 | `object` | - | 透传 AutoComplete 属性，`value` / `onChange` / `options` / `onSearch` 由内部管理 | - |

### 字段映射配置 (fieldNames)
```javascript
{
  value: 'id',    // 选项值字段名
  label: 'name'   // 选项标签字段名
}
```

### 搜索机制
1. **防抖处理**：输入搜索关键字时有 200ms 的防抖延迟
2. **最小字符数**：通过 `searchMinEnter` 控制最小搜索字符数
3. **空搜索**：当 `searchMinEnter` 为 0 时允许空搜索
4. **加载状态**：搜索过程中显示加载指示器

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

const staticOptions = [
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3' },
];

export default () => {
  const [remoteValue, setRemoteValue] = useState('');
  const [staticValue, setStaticValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <div>场景1：远程搜索</div>
      <RestAutoComplete
        style={{ width: 320 }}
        restful="https://dummyjson.com/users/search"
        parseRowsPath="users"
        value={remoteValue}
        onChange={setRemoteValue}
        fieldNames={{ value: 'firstName', label: 'firstName' }}
        labelTemplate="{firstName} (@{username})"
        searchKey="q"
        antdAutoCompleteProps={{ style: { width: 320 }, placeholder: '输入用户名搜索' }}
      />
      <div>当前远程搜索值：{remoteValue || '-'}</div>

      <div>场景2：静态选项</div>
      <RestAutoComplete
        style={{ width: 320 }}
        options={staticOptions}
        value={staticValue}
        onChange={setStaticValue}
        antdAutoCompleteProps={{ style: { width: 320 } }}
      />
      <div>当前静态值：{staticValue || '-'}</div>

      <div>场景3：只读模式</div>
      <RestAutoComplete
        style={{ width: 320 }}
        value="示例值"
        readOnly
      />
    </div>
  );
};
```

### 高级用法

#### 复杂搜索条件
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

export default () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <RestAutoComplete
        style={{ width: 320 }}
        restful="https://dummyjson.com/users/search"
        parseRowsPath="users"
        value={value}
        onChange={setValue}
        baseParams={{ limit: 10 }}
        searchKey="q"
        fieldNames={{ value: 'id', label: 'firstName' }}
        labelTemplate="{firstName} (@{username})"
        antdAutoCompleteProps={{ style: { width: 320 } }}
      />
      <div>当前选中值：{value || '-'}</div>
    </div>
  );
};
```

#### 自定义数据解析
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestAutoComplete } } = antdRestful;

export default () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <RestAutoComplete
        style={{ width: 320 }}
        restful="https://dummyjson.com/users/search"
        value={value}
        onChange={setValue}
        parseRowsPath="users"
        fieldNames={{ value: 'id', label: 'firstName' }}
        antdAutoCompleteProps={{ style: { width: 320 } }}
      />
      <div>当前选中值：{value || '-'}</div>
    </div>
  );
};
```

### API 响应格式
组件期望的 API 响应格式：

```javascript
{
  "users": [
      {
        "id": 1,
        "firstName": "Emily",
        "email": "emily.johnson@x.dummyjson.com"
      },
      {
        "id": 2,
        "firstName": "Michael",
        "email": "michael.williams@x.dummyjson.com"
      }
  ],
  "total": 208
}
```

使用不同 `parseRowsPath` 时：
```javascript
{
  "products": [
        {
          "id": 1,
          "title": "Essence Mascara Lash Princess"
        }
      ]
}
```

### 请求参数说明
- **搜索参数**：通过 `searchKey` 指定的参数名传递用户输入的搜索关键字
- **基础参数**：`baseParams` 会在每次请求中附加
- **示例请求**：`GET https://dummyjson.com/users/search?q=emily&limit=10`

### 远程接口要求
- 接口需支持按关键字查询（如 `q` / `search`），并返回匹配列表。
- 返回列表项需包含“值字段 + 标签字段”（例如 `id` 与 `firstName/title`），并通过 `fieldNames` 映射。
- 响应结构需与 `parseRowsPath` 对齐（例如 `users` 或 `products`）。
- 建议支持分页/limit 参数，避免一次返回过大数据集。
- 建议接口响应稳定在 200ms~500ms 内，配合组件防抖体验更好。

### 字段映射建议
- `RestAutoComplete` 会把 `fieldNames.value` 作为输入框显示值；若你配置 `value: 'id'`，输入框里就会显示 `id`。
- 若希望输入框展示“姓名/标题”等文本，请将 `fieldNames.value` 映射到文本字段（如 `firstName`、`title`）。
- 用户类接口常见返回：`{ id, firstName, email }`，建议：
  - `parseRowsPath="users"`
  - `fieldNames={{ value: 'firstName', label: 'firstName' }}`
  - `labelTemplate="{firstName} (@{username})"`
- 商品类接口常见返回：`{ id, title }`，建议：
  - `parseRowsPath="products"`
  - `fieldNames={{ value: 'title', label: 'title' }}`
  - `labelTemplate="{title}"`

### 注意事项
1. **搜索防抖**：组件内置 200ms 的搜索防抖机制，避免频繁请求
2. **最小输入长度**：通过 `searchMinEnter` 控制最小搜索字符数，减少无效请求
3. **字段映射**：`fieldNames` 用于映射 API 返回数据的字段名到组件需要的格式
4. **标签模板**：`labelTemplate` 支持使用 `{fieldName}` 语法自定义显示格式
5. **只读模式**：只读时直接显示文本内容，不显示输入框
6. **加载状态**：搜索过程中会显示加载指示器
7. **空搜索**：当 `searchMinEnter` 为 0 时，允许在输入框为空时触发搜索
8. **数据解析**：通过 `parseRowsPath` 指定从 API 响应中解析数据的路径
9. **原生属性**：通过 `antdAutoCompleteProps` 可以传递任何 Ant Design AutoComplete 的原生属性

### 相关组件
- [RestSelect](./RestSelect.md) - 远程下拉选择器
- [MentionView](./MentionView.md) - 提及选择器
- [TableSelect](./TableSelect.md) - 表格选择器
