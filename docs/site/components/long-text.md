---
title: LongText
order: 5
---

## LongText
A component for displaying long text, supporting text truncation, modal display, and template formatting.

**Features:**
- Supports strings, numbers, booleans, arrays, objects, and other data types
- Automatically truncates overly long content and shows a "View More" button
- Supports template formatting for object data
- Modal displays full content (object template scenarios support raw data toggle)
- Responsive design that adapts to different screen sizes
- Intelligently determines whether to show the expand button
- Supports custom modal configuration

### API
| <div style="width: 17ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | - | - |
| className | Custom class name | `string` | - | - | - |
| **Data & Display** | | | | | |
| value | Text content to display | `any` | - | - | - |
| maxLength | Maximum display length; element count for arrays, character count for strings | `number` | `64` | - | - |
| titleTemplate | Title display template for selected count; must include `{count}` placeholder | `string` | `"Length: {count}"` | - | - |
| titleAggPath | Aggregate selected data by field and show in title; use `{stat}` placeholder in titleTemplate | `string` | - | - | - |
| separator | Separator between array elements | `string` | `'\n'` | - | - |
| labelTemplate | Display template for objects or array of objects; supports `{field}` format | `string` | - | - | - |
| **Ant Design Native Config** | | | | | |
| antdModalProps | Ant Design [Modal](https://ant.design/components/modal-cn) props | `object` | - | Pass-through Modal props; `open` / `onCancel` / `footer` managed internally; custom `title` overrides built-in title | - |

### Examples

**Basic text display:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <LongText value="This is a short text" />
    <LongText
      value="This is a very long text that exceeds the default length and will be truncated with a View More button; click to see the full content in a modal"
      maxLength={20}
    />
    <LongText value="Example text with custom truncation length" maxLength={10} />
  </div>
);
```

**Array data display:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon', 'Strawberry']}
    separator=" | "
    maxLength={3}
  />
);
```

**Object template display:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={[
      { id: 1, username: 'admin', nickname: 'Admin', department: 'Engineering' },
      { id: 2, username: 'skyler', nickname: 'Skyler', department: 'Product' },
    ]}
    labelTemplate="{nickname} - {department}"
    maxLength={1}
    separator="\n"
  />
);
```

**Custom modal:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value="This is a longer text demonstrating custom modal configuration. Click View More to open the modal."
    maxLength={20}
    antdModalProps={{
      title: 'Details',
      width: 720,
      centered: true,
      maskClosable: false,
    }}
  />
);
```

**Data type handling:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={{
      user: { name: 'Alice', id: 1 },
      permissions: ['read', 'write', 'delete'],
      settings: { theme: 'dark', language: 'zh-CN' },
    }}
    maxLength={80}
  />
);
```

**Usage in tables:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable, LongText } = antdRestful;

const columns = [
  {
    title: 'Description',
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

**Raw data toggle:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value={[
      { id: 1, name: 'Product A', specs: { color: 'Red', size: 'L' } },
      { id: 2, name: 'Product B', specs: { color: 'Blue', size: 'M' } },
    ]}
    labelTemplate="{name} - {specs.color} {specs.size}"
    maxLength={1}
  />
);
```

**Responsive display:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <LongText
    value="This is a long text that needs to display on different devices"
    maxLength={36}
    antdModalProps={{ width: 600 }}
  />
);
```

**Empty value handling:**

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

**Combined with other components:**

```jsx
import React from 'react';
import { Card, Space, Tag } from 'antd';
import antdRestful from 'antd-restful';
const { LongText } = antdRestful;

export default () => (
  <Card title="Project Details">
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Tag color="blue">Data:</Tag>
        <LongText value={['A', 'B', 'C', 'D']} maxLength={2} />
      </Space>
      <LongText value="This is the project description; expand to view full content when it exceeds the length limit." maxLength={20} />
    </Space>
  </Card>
);
```

### Best Practices

1. **Set truncation length appropriately**: Configure `maxLength` based on UI space and content importance
2. **Choose appropriate separators**: Use readable separators when displaying arrays
3. **Template design**: Object templates should highlight important information and stay concise
4. **Modal configuration**: Configure appropriate modal size based on content type
5. **Responsive considerations**: Reduce truncation length appropriately on mobile
6. **Performance optimization**: For large datasets, consider virtual scrolling or pagination

### Use Cases

- **Data tables**: Display long text fields such as descriptions and notes
- **User lists**: Display multiple user records with template formatting
- **Log viewing**: Display long log content with modal viewing
- **Configuration display**: Display complex configuration objects
- **Tag management**: Display multiple tags with automatic folding when exceeding limits

### FAQ

**Q: How do I customize the "View More" button style?**
A: Override the relevant CSS class names globally.

**Q: What happens when a field in the template doesn't exist?**
A: Missing fields display as empty strings and do not cause errors.

**Q: How do I display rich text in the modal?**
A: Set styles via `antdModalProps.bodyStyle` and ensure the data contains HTML tags.
