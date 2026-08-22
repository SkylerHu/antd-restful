---
title: LongText
order: 5
---

## LongText
是一个用于显示长文本的组件，支持文本截断、模态框展示和模板格式化。

**功能特性：**
- 支持字符串、数字、布尔值、数组、对象等多种数据类型
- 自动截断超长内容，显示"查看更多"按钮
- 支持模板格式化显示对象数据
- 模态框展示完整内容（对象模板场景支持原始数据切换）
- 响应式设计，适配不同屏幕尺寸
- 智能识别是否需要显示展开按钮
- 支持自定义模态框配置

### 参数说明
| <div style="width: 17ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | - | - |
| className | 自定义类名 | `string` | - | - | - |
| **数据与显示** | | | | | |
| value | 要显示的文本内容 | `any` | - | - | - |
| maxLength | 最大显示长度，数组时为元素个数，字符串时为字符数 | `number` | `64` | - | - |
| titleTemplate | 选中个数的标题显示模板，必须包含 `{count}` 占位符 | `string` | `"长度：{count}"` | - | - |
| titleAggPath | 选中数据根据字段聚合统计显示在 title 上，titleTemplate 中使用 `{stat}` 占位符 | `string` | - | - | - |
| separator | 数组元素间的分隔符 | `string` | `'\n'` | - | - |
| labelTemplate | 对象或数组对象的显示模板，支持 `{field}` 格式 | `string` | - | - | - |
| **Ant Design 原生配置** | | | | | |
| antdModalProps | Ant Design [Modal](https://ant.design/components/modal-cn) 组件的属性 | `object` | - | 透传 Modal 属性，`open` / `onCancel` / `footer` 由内部管理；自定义 `title` 会覆盖内置标题 | - |

### 使用示例

**基本文本显示：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <LongText value="这是一段短文本" />
    <LongText
      value="这是一段很长的文本内容，超过默认长度会自动截断并显示查看更多按钮，点击可以在模态框中查看完整内容"
      maxLength={20}
    />
    <LongText value="自定义截断长度的文本内容示例" maxLength={10} />
  </div>
);
```

**数组数据显示：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓']}
    separator=" | "
    maxLength={3}
  />
);
```

**对象模板显示：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={[
      { id: 1, username: 'admin', nickname: '管理员', department: '技术部' },
      { id: 2, username: 'skyler', nickname: 'Skyler', department: '产品部' },
    ]}
    labelTemplate="{nickname} - {department}"
    maxLength={1}
    separator="\n"
  />
);
```

**模态框自定义：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value="这是一段较长文本，用于演示自定义弹窗配置。点击查看更多可打开弹窗。"
    maxLength={20}
    antdModalProps={{
      title: '详细内容',
      width: 720,
      centered: true,
      maskClosable: false,
    }}
  />
);
```

**数据类型处理：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={{
      user: { name: '张三', id: 1 },
      permissions: ['read', 'write', 'delete'],
      settings: { theme: 'dark', language: 'zh-CN' },
    }}
    maxLength={80}
  />
);
```

**在表格中的应用：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable, LongText } = antdRestful;

const columns = [
  {
    title: '描述',
    dataIndex: 'body',
    render: (text) => <LongText value={text} maxLength={50} />,
  },
];

export default () => (
  <RestTable
    restful="https://dummyjson.com/posts"
    parseRowsPath="posts"
    parseTotalPath="total"
    fieldPage="skip"
    fieldPageSize="limit"
    baseParams={{ limit: 5 }}
    columns={columns}
    rowKey="id"
  />
);
```

**原始数据切换：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={[
      { id: 1, name: '产品A', specs: { color: '红色', size: 'L' } },
      { id: 2, name: '产品B', specs: { color: '蓝色', size: 'M' } },
    ]}
    labelTemplate="{name} - {specs.color} {specs.size}"
    maxLength={1}
  />
);
```

**响应式显示：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value="这是一段需要在不同设备上显示的长文本内容"
    maxLength={36}
    antdModalProps={{ width: 600 }}
  />
);
```

**空值处理：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 8 }}>
    <LongText value="" />
    <LongText value={[]} />
    <LongText value={{}} />
  </div>
);
```

**结合其他组件：**

```jsx
import React from 'react';
import { Card, Space, Tag } from 'antd';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <Card title="项目详情">
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Tag color="blue">数据：</Tag>
        <LongText value={['A', 'B', 'C', 'D']} maxLength={2} />
      </Space>
      <LongText value="这里是项目描述，超过长度后可展开查看完整内容。" maxLength={20} />
    </Space>
  </Card>
);
```

### 最佳实践

1. **合理设置截断长度**：根据界面空间和内容重要性设置 `maxLength`
2. **选择合适的分隔符**：数组显示时选择易读的分隔符
3. **模板设计**：对象模板应突出重要信息，保持简洁
4. **模态框配置**：根据内容类型配置合适的模态框尺寸
5. **响应式考虑**：在移动端适当减少截断长度
6. **性能优化**：对于大量数据，考虑虚拟滚动或分页

### 使用场景

- **数据表格**：显示长文本字段，如描述、备注等
- **用户列表**：显示多个用户信息，支持模板格式化
- **日志查看**：显示长日志内容，支持模态框查看
- **配置展示**：显示复杂配置对象
- **标签管理**：显示多个标签，超出时自动折叠

### 常见问题

**Q: 如何自定义"查看更多"按钮的样式？**
A: 可以通过全局 CSS 覆盖相关样式类名。

**Q: 模板中的字段不存在怎么办？**
A: 不存在的字段会显示为空字符串，不会报错。

**Q: 如何在模态框中显示富文本？**
A: 可以通过 `antdModalProps.bodyStyle` 设置样式，并确保数据包含 HTML 标签。
