---
title: RestTreeSelect
order: 5
---

## RestTreeSelect
基于 Ant Design TreeSelect 组件扩展的远程树形选择器，支持远程数据懒加载、树形结构展示、复制等功能。

**功能特性：**
- 支持远程数据懒加载
- 支持树形结构数据展示
- 支持单选和多选模式
- 支持复制功能
- 支持只读模式展示
- 支持自定义字段名映射

### 参数说明
| <div style="width: 21ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 TreeSelect `style` | - |
| className | 自定义类名 | `string` | - | 透传 TreeSelect `className` | - |
| value | 当前选中的值 | `any` | - | 透传 TreeSelect `value` | - |
| onChange | 值变化时的回调函数 | `function(value, nodes)` | - | 覆盖 TreeSelect `onChange`，增加 nodes 参数 | - |
| **远程数据相关** | | | | | |
| restful | 远程接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| baseParams | 基础请求参数 | `object` | - | - | - |
| labelTemplate | 标签模板 | `string` | - | - | - |
| fieldParent | 父级字段名 | `string` | `'parent'` | - | - |
| parseRowsPath | 解析数据路径 | `string` | `'results'` | - | - |
| **字段映射** | | | | | |
| fieldNames | 字段映射 | `object` | - | 透传 TreeSelect `fieldNames` | - |
| treeNodeLabelProp | 树节点标签属性 | `string` | - | 透传 TreeSelect `treeNodeLabelProp` | - |
| **状态控制** | | | | | |
| enableCopy | 是否启用复制功能 | `boolean` | `false` | - | - |
| separator | 多选时复制值之间的分隔符 | `string` | `','` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | 透传 TreeSelect `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| treeData | 静态树形数据 | `array` | - | 覆盖 TreeSelect `treeData`，远程模式由内部管理 | - |
| **Ant Design 原生配置** | | | | | |
| antdTreeSelectProps | Ant Design [TreeSelect](https://ant.design/components/tree-select-cn) 组件属性 | `object` | - | 透传 TreeSelect 属性，`value` / `onChange` / `treeData` / `loadData` 由内部管理 | - |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件属性 | `object` | - | 透传 Space 属性 | - |

### 字段映射配置 (fieldNames)
```javascript
{
  value: 'key',      // 选项值字段名
  label: 'name',     // 选项标签字段名
  children: 'children' // 子级字段名
}
```

### 回调函数参数说明
`onChange` 回调函数接收两个参数：
- `value`: 当前选中的值
- `nodes`: 当前选中的节点对象数组

### 使用示例

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { RestTreeSelect } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

const treeData = [
  {
    id: 1,
    firstName: 'Emily',
    children: [
      { id: 11, firstName: 'Emily-Child-A' },
      { id: 12, firstName: 'Emily-Child-B' },
    ],
  },
  {
    id: 2,
    firstName: 'Michael',
    children: [
      { id: 21, firstName: 'Michael-Child-A' },
    ],
  },
];

export default () => {
  const [mode, setMode] = useState('edit');
  const [singleValue, setSingleValue] = useState();
  const [multipleValue, setMultipleValue] = useState([]);

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
        <Divider orientation="left" style={{ margin: '8px 0' }}>场景1：单选模式</Divider>
        <Form.Item label="选择值" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            style={{ width: 320 }}
            treeData={treeData}
            fieldNames={{ value: 'id', label: 'firstName', children: 'children' }}
            value={singleValue}
            onChange={setSingleValue}
            readOnly={readOnly}
            disabled={disabled}
            antdTreeSelectProps={{ placeholder: '请选择单个节点', style: { width: '100%' } }}
          />
          <div style={valueStyle}>表单value值：{JSON.stringify(singleValue ?? null)}</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>场景2：多选模式 + 复制</Divider>
        <Form.Item label="多选值" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            style={{ width: 320 }}
            treeData={treeData}
            fieldNames={{ value: 'id', label: 'firstName', children: 'children' }}
            value={multipleValue}
            onChange={setMultipleValue}
            readOnly={readOnly}
            disabled={disabled}
            antdTreeSelectProps={{ multiple: true, treeCheckable: true, placeholder: '请选择多个节点' }}
            enableCopy
          />
          <div style={valueStyle}>表单value值：{JSON.stringify(multipleValue)}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### API 数据格式示例

RestTreeSelect 期望的 API 响应数据格式如下：

```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Emily",
      "lastName": "Johnson"
    },
    {
      "id": 2,
      "firstName": "Michael",
      "lastName": "Williams"
    }
  ],
  "total": 208
}
```

其中：
- 示例使用 `parseRowsPath="users"` 解析列表数据
- 通过 `fieldNames` 将 `id` / `firstName` 映射到 value / label
- 若需要严格树形结构，建议使用具备 parent/children 关系的数据源

### 注意事项
1. **字段映射**：通过 `fieldNames` 配置数据字段映射
2. **父子关系**：`fieldParent` 指定父级字段名，用于建立树形关系
3. **懒加载**：只有展开节点时才会加载子节点数据
4. **复制功能**：启用后可复制选中的值
5. **只读模式**：以标签形式展示选中的值
