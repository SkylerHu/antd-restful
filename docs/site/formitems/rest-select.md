---
title: RestSelect
order: 9
---

## RestSelect
基于 Ant Design Select 组件扩展的远程选择器，支持远程数据获取、搜索、多选等功能。

**功能特性：**
- 支持远程数据获取和搜索
- 支持单选和多选模式
- 支持数据缓存和去重
- 支持复制功能
- 支持只读模式展示
- 支持自定义字段名映射
- 支持自定义标签模板

### 参数说明
| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 Select `style` | - |
| className | 自定义类名 | `string` | - | 透传 Select `className` | - |
| value | 选中的值 | `any` | - | 透传 Select `value` | - |
| onChange | 值变化时的回调函数 | `function(value, option)` | - | 透传 Select `onChange` | - |
| **远程数据相关** | | | | | |
| restful | 远程获取数据的接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| urlDetailTemplate | 根据 value 初始化能够 get 到对应 options 的接口地址；函数输入参数即初始化的 value，多选时是数组 | `string` | - | - | - |
| baseParams | 接口筛选条件 | `object` | - | - | - |
| searchKey | 模糊搜索使用的参数名 | `string` | `'search'` | - | - |
| fieldPageSize | 每页条数的参数名，用于初始化详情请求时动态设置 page_size | `string` | `'page_size'` | - | - |
| searchMinEnter | 最少输入字符数，为 0 时允许为空时获取远程 options | `number` | `0` | - | - |
| parseRowsPath | 从接口返回值解析出列表数据的路径 | `string` | `'results'` | - | - |
| **显示和交互** | | | | | |
| enableCopy | 是否启用复制功能 | `boolean` | `false` | - | - |
| separator | 复制时，值之间的分隔符 | `string` | `','` | - | - |
| labelTemplate | 远程接口返回数据的 label 模板 | `string` | - | - | - |
| **原生组件支持** | | | | | |
| labelInValue | 使用该方式的时候，fieldNames 配置将失效 | `boolean` | `false` | 透传 Select `labelInValue` | - |
| fieldNames | 通 antd 官方配置，配置 options 的 key/value 字段 | `object` | - | 透传 Select `fieldNames` | - |
| options | 初始化的下拉选项 | `array` | - | 覆盖 Select `options`，由内部管理远程数据 | - |
| mode | 选择模式，默认单选，多选设置为 'multiple' | `string` | - | 透传 Select `mode` | - |
| disabled | 是否禁用 | `boolean` | `false` | 透传 Select `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的原生属性 | `object` | - | 透传 Space 属性 | - |
| antdSelectProps | Ant Design [Select](https://ant.design/components/select-cn) 组件的原生属性 | `object` | - | 透传 Select 属性，`value` / `onChange` / `options` / `loading` / `onSearch` 由内部管理 | - |

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

const options = [
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  { value: 3, label: '选项3' },
];

export default () => {
  const [singleValue, setSingleValue] = useState(1);
  const [multipleValue, setMultipleValue] = useState([1, 2]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <RestSelect
        options={options}
        value={singleValue}
        onChange={setSingleValue}
        antdSelectProps={{ style: { width: 320 } }}
      />
      <div>当前单选值：{String(singleValue ?? '')}</div>
      <RestSelect
        options={options}
        mode="multiple"
        value={multipleValue}
        onChange={setMultipleValue}
        enableCopy
        style={{ width: 320 }}
        antdSpaceProps={{ block: false }}
        antdSelectProps={{ style: { width: 280 } }}
      />
      <div>当前多选值：{JSON.stringify(multipleValue)}</div>
      <RestSelect
        style={{ width: 320 }}
        options={options}
        mode="multiple"
        value={[1, 2]}
        readOnly
        enableCopy
      />
    </div>
  );
};
```

### 高级用法

#### 自定义接口详情地址
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

export default () => {
  const [value, setValue] = useState(123);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RestSelect
        style={{ width: 320 }}
        restful="https://dummyjson.com/users"
        parseRowsPath="users"
        fieldPageSize="limit"
        fieldNames={{ value: 'id', label: 'firstName' }}
        urlDetailTemplate="https://dummyjson.com/users/{0}"
        value={value}
        onChange={setValue}
      />
      <div>当前选中值：{String(value ?? '')}</div>
    </div>
  );
};
```

#### 复杂搜索条件
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestSelect } } = antdRestful;

export default () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RestSelect
        style={{ width: 320 }}
        restful="https://dummyjson.com/products"
        parseRowsPath="products"
        fieldPageSize="limit"
        value={value}
        onChange={setValue}
        baseParams={{
          limit: 10
        }}
        searchKey="q"
        searchMinEnter={3}
        fieldNames={{ value: 'id', label: 'title' }}
        labelTemplate="{title} - ¥{price}"
      />
      <div>当前选中值：{String(value ?? '')}</div>
    </div>
  );
};
```

### 注意事项
1. **远程数据**：使用 `restful` 属性时，组件会自动进行搜索防抖处理
2. **数据缓存**：已选中的选项会被缓存，避免重复请求
3. **字段映射**：使用 `fieldNames` 可以自定义数据字段映射，支持复杂的数据结构
4. **搜索优化**：`searchMinEnter` 可以控制最小搜索字符数，减少无效请求
5. **复制功能**：启用 `enableCopy` 后，在只读模式或选择器旁边会显示复制按钮
6. **labelInValue**：启用后返回的 value 包含 label 信息，此时 `fieldNames` 配置无效

### 相关组件
- [RestCascader](./RestCascader.md) - 远程级联选择器
- [RestTreeSelect](./RestTreeSelect.md) - 远程树形选择器
- [RestAutoComplete](./RestAutoComplete.md) - 远程自动完成选择器
- [TableSelect](./TableSelect.md) - 表格选择器
