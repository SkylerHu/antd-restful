---
title: TableSelect
order: 2
---

## TableSelect
基于 RestTable 组件的表格选择器，支持多行选择、展示已选数据、取消选择等功能，适用于需要在表格中进行多选操作的场景。

**功能特性：**
- 支持表格形式的多行选择
- 支持展示已选中的数据
- 支持取消选择操作
- 支持折叠/展开已选数据区域
- 支持只读和禁用模式
- 完全继承 RestTable 的所有功能

### 参数说明
| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| value | 值仅支持对象数组格式 | `array<object>` | - | - | - |
| onChange | 值变化时的回调函数 | `function(selectedRows)` | - | - | - |
| **交互控制** | | | | | |
| disabled | 禁用后只读 | `boolean` | `false` | - | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| expandSelected | 是否默认展开显示选中数据 | `boolean` | `true` | - | - |
| **数据配置** | | | | | |
| rowKey | 表格行的唯一键名 | `string` | `'id'` | 透传 Table `rowKey` | - |
| columns | 表格列配置 | `array` | `[]` | 透传 Table `columns` | - |
| titleTemplate | 选中个数的标题显示模板，必须包含 `{count}` 占位符 | `string` | `选中 {count} 条数据` | - | - |
| titleAggPath | 选中数据根据字段聚合统计显示在title上，titleTemplate中使用 `{stat}` 占位符 | `string` | - | - | 0.1.2 |
| **Ant Design 原生配置** | | | | | |
| antdTableProps | Ant Design [Table](https://ant.design/components/table-cn) 组件的原生属性 | `object` | - | 透传 Table 属性，`rowSelection` / `dataSource` 由内部管理 | - |
| antdTableReadProps | 用于配置只读的Table，覆盖 antdTableProps | `object` | - | 透传只读 Table 属性 | - |
| antdCollapseProps | Ant Design [Collapse](https://ant.design/components/collapse-cn) 组件的原生属性 | `object` | - | 透传 Collapse 属性 | - |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的原生属性 | `object` | - | 透传 Space 属性 | - |
| **RestTable 属性** | | | | | |
| ...restProps | 继承 RestTable 的所有其他属性 | - | - | - | - |

### 数据格式
- **输入值**：必须是对象数组格式 `[{}, {}, ...]`
- **输出值**：选中的行数据对象数组

### 组件结构
1. **已选数据区域**：可折叠的面板，显示已选中的数据表格
2. **数据选择区域**：RestTable 表格，用于浏览和选择数据
3. **取消选择**：在已选数据中每行都有取消选择按钮

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '姓名', dataIndex: 'firstName', key: 'firstName' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
];

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TableSelect
        restful="https://dummyjson.com/users"
        parseRowsPath="users"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        baseParams={{ limit: 8 }}
        value={selectedRows}
        onChange={setSelectedRows}
        columns={columns}
        rowKey="id"
        antdTableProps={{ size: 'small' }}
      />
      <div>当前选中行数：{selectedRows.length}</div>
      <pre style={{ maxHeight: 160, overflow: 'auto', margin: 0 }}>
        {JSON.stringify(selectedRows, null, 2)}
      </pre>
    </div>
  );
};
```

### 高级用法

#### 表单集成示例
```jsx
import React from 'react';
import { Form, Button } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
  ];

  const handleSubmit = (values) => {
    console.log('表单值:', values);
    console.log('选中用户:', values.selectedUsers);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="selectedUsers"
        label="选择用户"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value || value.length === 0) {
                return Promise.reject('请至少选择一个用户');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <TableSelect
          restful="https://dummyjson.com/users"
          parseRowsPath="users"
          parseTotalPath="total"
          fieldPage="skip"
          fieldPageSize="limit"
          baseParams={{ limit: 10 }}
          columns={columns}
          rowKey="id"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
```

#### 自定义折叠面板示例
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TableSelect
        restful="https://dummyjson.com/products"
        parseRowsPath="products"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        baseParams={{ limit: 10 }}
        value={selectedRows}
        onChange={setSelectedRows}
        columns={columns}
        rowKey="id"
        expandSelected={false}
        antdCollapseProps={{
          size: 'small',
          ghost: true,
          collapsible: 'header',
        }}
      />
      <div>当前选中行数：{selectedRows.length}</div>
    </div>
  );
};
```

#### 带分页的大数据表格示例
```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { TableSelect } } = antdRestful;

export default () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'tags',
      key: 'tags',
      width: 100,
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TableSelect
        restful="https://dummyjson.com/posts"
        parseRowsPath="posts"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        baseParams={{ limit: 10 }}
        value={selectedRows}
        onChange={setSelectedRows}
        columns={columns}
        rowKey="id"
        antdTableProps={{
          scroll: { y: 400 },
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          },
          rowSelection: {
            preserveSelectedRowKeys: true,
          },
        }}
      />
      <div>当前选中行数：{selectedRows.length}</div>
    </div>
  );
};
```

### 行为说明
1. **选择行为**：点击表格行的复选框进行选择/取消选择
2. **已选数据展示**：在折叠面板中以表格形式展示已选数据
3. **取消选择**：在已选数据表格的每一行都有红色叉号按钮用于取消选择
4. **数据持久化**：选中的行在翻页或搜索时会被保持
5. **去重处理**：基于 `rowKey` 进行去重，避免重复选择

### 状态管理
- **disabled**：禁用后组件变为只读，无法进行选择操作
- **readOnly**：只读模式下只显示已选数据，不显示数据选择区域
- **expandSelected**：控制已选数据区域是否默认展开

### 注意事项
1. **数据格式**：value 必须是对象数组格式，每个对象必须包含 `rowKey` 指定的字段
2. **rowKey 唯一性**：确保 `rowKey` 字段的值在数据中是唯一的
3. **列配置**：`columns` 配置会同时应用到选择表格和已选数据表格
4. **继承属性**：组件继承了 RestTable 的所有属性，支持分页、搜索、排序等功能
5. **选择状态保持**：通过 `preserveSelectedRowKeys` 确保翻页时选择状态不丢失
6. **取消选择**：组件会自动在已选数据表格中添加取消选择列
7. **Ant Design 兼容**：自动适配 Ant Design v4 和 v5 的 Collapse 组件 API 差异

### 远程接口要求
- 列表接口需支持分页字段映射（如 `fieldPage` / `fieldPageSize`），并返回总数（`parseTotalPath`）。
- 列表数据路径需与 `parseRowsPath` 对齐（如 `users` / `products` / `posts`）。
- 每行数据需包含稳定唯一键（与 `rowKey` 对应，例如 `id`）。
- 如果启用快速搜索，后端需支持 `searchKey` 对应的模糊查询参数。
