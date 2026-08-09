---
title: RestCascader
---

## RestCascader
基于 Ant Design Cascader 组件扩展的远程级联选择器，支持远程数据懒加载、多选、复制等功能。

**功能特性：**
- 支持远程数据懒加载获取
- 支持单选和多选模式
- 支持树形结构数据展示
- 支持复制功能
- 支持只读模式展示
- 支持自定义字段名映射
- 支持父子关系动态加载

### 参数说明
| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 Cascader `style` | - |
| className | 自定义类名 | `string` | - | 透传 Cascader `className` | - |
| value | 选中的值（数组格式，表示路径） | `array` | - | 透传 Cascader `value` | - |
| onChange | 值变化时的回调函数 | `function(value, selectedOptions, treeOpts)` | - | 覆盖 Cascader `onChange`，增加 treeOpts 参数 | - |
| **远程数据相关** | | | | | |
| restful | 远程数据接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| baseParams | 基础请求参数 | `object` | - | - | - |
| fieldParent | 父级字段名 | `string` | `'parent'` | - | - |
| parseRowsPath | 解析数据路径 | `string` | `'data.results'` | - | - |
| **显示和交互** | | | | | |
| enableCopy | 是否启用复制功能 | `boolean` | `false` | - | - |
| separator | 复制时，路径之间的分隔符 | `string` | `' / '` | - | - |
| **原生组件支持** | | | | | |
| options | 静态数据 | `array` | - | 覆盖 Cascader `options`，远程模式由内部管理 | - |
| fieldNames | 字段映射配置 | `object` | - | 透传 Cascader `fieldNames` | - |
| disabled | 是否禁用 | `boolean` | `false` | 透传 Cascader `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的原生属性 | `object` | - | 透传 Space 属性 | - |
| antdCascaderProps | Ant Design [Cascader](https://ant.design/components/cascader-cn) 组件的原生属性 | `object` | - | 透传 Cascader 属性，`value` / `onChange` / `options` / `loadData` 由内部管理 | - |

### 字段映射配置 (fieldNames)
```javascript
{
  value: 'id',        // 选项值字段名
  label: 'name',      // 选项标签字段名
  children: 'children' // 子选项字段名
}
```

### 数据加载机制
1. **懒加载**：首次加载根节点数据，展开时动态加载子节点
2. **父子关系**：通过 `fieldParent` 字段建立父子关系
3. **去重处理**：避免重复请求相同节点的数据
4. **缓存机制**：已加载的节点数据会被缓存

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

export default () => {
  const [basicValue, setBasicValue] = useState();
  const [multiValue, setMultiValue] = useState([]);
  const [staticValue, setStaticValue] = useState();
  const [separatorValue, setSeparatorValue] = useState();
  const [fieldNamesValue, setFieldNamesValue] = useState();

  const options = [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'haidian',
          label: '海淀区',
        },
        {
          value: 'chaoyang',
          label: '朝阳区',
        },
      ],
    },
    {
      value: 'shanghai',
      label: '上海',
      children: [
        {
          value: 'huangpu',
          label: '黄浦区',
        },
      ],
    },
  ];

  const mappedOptions = [
    {
      id: 'tech',
      name: '技术线',
      nodes: [
        { id: 'frontend', name: '前端组' },
        { id: 'backend', name: '后端组' },
      ],
    },
    {
      id: 'product',
      name: '产品线',
      nodes: [
        { id: 'pm', name: '产品经理组' },
        { id: 'ux', name: '交互设计组' },
      ],
    },
  ];

  // labelTemplate 风格：通过预处理 options 生成展示字段。
  const templatedOptions = mappedOptions.map((item) => ({
    ...item,
    displayName: `${item.name} (${item.id})`,
    nodes: (item.nodes || []).map((child) => ({
      ...child,
      displayName: `${child.name} (${child.id})`,
    })),
  }));

  const readonlyOptions = [
    {
      value: 'tech',
      label: '技术部',
      children: [
        { value: 'frontend', label: '前端组' },
        { value: 'backend', label: '后端组' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <div>场景1：基础级联（静态可渲染）</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={basicValue}
        onChange={setBasicValue}
        antdCascaderProps={{ placeholder: '请选择城市路径' }}
      />
      <div>当前基础值：{JSON.stringify(basicValue ?? null)}</div>

      <div>场景2：多选模式 + 复制</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={multiValue}
        onChange={setMultiValue}
        enableCopy
        antdCascaderProps={{ multiple: true, placeholder: '请选择多个城市路径' }}
      />
      <div>当前多选值：{JSON.stringify(multiValue ?? null)}</div>

      <div>场景3：静态数据</div>
      <RestCascader style={{ width: 320 }} options={options} value={staticValue} onChange={setStaticValue} />
      <div>当前静态值：{JSON.stringify(staticValue ?? null)}</div>

      <div>场景4：只读模式</div>
      <RestCascader options={readonlyOptions} value={['tech', 'frontend']} readOnly enableCopy />

      <div>场景5：自定义分隔符</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={separatorValue}
        onChange={setSeparatorValue}
        separator=" > "
      />
      <div>当前分隔符场景值：{JSON.stringify(separatorValue ?? null)}</div>

      <div>场景6：fieldNames + labelTemplate 风格展示</div>
      <RestCascader
        style={{ width: 320 }}
        options={templatedOptions}
        value={fieldNamesValue}
        onChange={setFieldNamesValue}
        fieldNames={{ value: 'id', label: 'displayName', children: 'nodes' }}
        antdCascaderProps={{ placeholder: '请选择组织路径（模板标签）' }}
      />
      <div>当前 fieldNames 场景值：{JSON.stringify(fieldNamesValue ?? null)}</div>
    </div>
  );
};
```

### 高级用法

#### 自定义字段映射
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

export default () => {
  const [value, setValue] = useState();
  const options = [
    {
      id: 'dept-a',
      text: '部门A',
      items: [
        { id: 'group-a1', text: '小组A1' },
        { id: 'group-a2', text: '小组A2' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <div>场景：自定义字段映射</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={value}
        onChange={setValue}
        fieldNames={{
          value: 'id',
          label: 'text',
          children: 'items'
        }}
      />
      <div>当前值：{JSON.stringify(value ?? null)}</div>
    </div>
  );
};
```

#### 多选模式配置
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { RestCascader } } = antdRestful;

export default () => {
  const [value, setValue] = useState([]);
  const options = [
    {
      value: 'permission',
      label: '权限',
      children: [
        { value: 'read', label: '只读' },
        { value: 'write', label: '可写' },
        { value: 'admin', label: '管理员' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <div>场景：多选模式配置</div>
      <RestCascader
        style={{ width: 320 }}
        options={options}
        value={value}
        onChange={setValue}
        antdCascaderProps={{
          multiple: true,
          maxTagCount: 'responsive',
          placeholder: '请选择权限',
          showCheckedStrategy: 'SHOW_CHILD'
        }}
        enableCopy
      />
      <div>当前值：{JSON.stringify(value ?? null)}</div>
    </div>
  );
};
```

### API 响应格式
组件期望的 API 响应格式：

**根节点请求**（parent__isnull=true）：
```javascript
{
  "data": {
    "results": [
      {
        "id": 1,
        "name": "北京市",
        "parent": null,
        "isLeaf": false
      },
      {
        "id": 2,
        "name": "上海市",
        "parent": null,
        "isLeaf": false
      }
    ]
  }
}
```

**子节点请求**（parent=1）：
```javascript
{
  "data": {
    "results": [
      {
        "id": 11,
        "name": "海淀区",
        "parent": 1,
        "isLeaf": true
      },
      {
        "id": 12,
        "name": "朝阳区",
        "parent": 1,
        "isLeaf": true
      }
    ]
  }
}
```

### 请求参数说明
- **初始化请求**：`{fieldParent}__isnull=true` 获取根节点
- **子节点请求**：`{fieldParent}={parentValue}` 获取指定父节点的子节点
- **基础参数**：`baseParams` 会在每次请求中附加

### 远程接口要求
- 接口需支持“按父节点查询子节点”，即能根据 `fieldParent` 返回下一级数据。
- 返回数据需包含唯一值字段（如 `id`）和展示字段（如 `name` / `title`），并通过 `fieldNames` 对齐。
- 非叶子节点建议返回 `isLeaf: false`，叶子节点返回 `isLeaf: true` 或不再返回子节点。
- 根节点请求建议支持 `parent__isnull=true`（或你后端约定的等价参数）。
- 组件会在展开节点时触发懒加载，请确保接口支持频繁小批量请求。

### 注意事项
1. **字段映射**：通过 `fieldNames` 配置数据字段映射，支持复杂数据结构
2. **标签模板**：组件本身无 `labelTemplate` 参数；若需要模板化标签，可先在 `options` 中预处理出展示字段，再通过 `fieldNames.label` 映射
3. **父子关系**：`fieldParent` 指定父级字段名，用于建立树形关系
4. **懒加载**：只有展开节点时才会加载子节点数据，提高性能
5. **叶子节点**：通过 `isLeaf` 字段或空子节点数组判断是否为叶子节点
6. **多选模式**：通过 `antdCascaderProps.multiple` 启用多选功能
7. **复制功能**：启用后可复制选中的完整路径
8. **只读模式**：以标签形式展示选中的路径，支持复制
9. **数据缓存**：已加载的节点数据会被缓存，避免重复请求
10. **路径值**：value 始终是数组格式，表示从根到叶子的完整路径
11. **回调参数**：onChange 提供选中路径、选中选项和树形选项三个参数

### 相关组件
- [RestSelect](./RestSelect.md) - 远程下拉选择器
- [RestTreeSelect](./RestTreeSelect.md) - 远程树形选择器
- [RestAutoComplete](./RestAutoComplete.md) - 远程自动完成选择器
