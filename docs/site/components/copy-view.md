---
title: CopyView
order: 6
---

## CopyView
A text display component with one-click copy functionality, suitable for scenarios that require copying.

**Features:**
- Supports copying multiple data types (string, number, boolean, array, object)
- Supports truncated text display while copying full content
- Supports custom separators
- Supports hidden value mode showing only the copy button
- Supports disabling copy functionality
- Shows a success message after copying
- Intelligently handles empty and invalid values
- Integrated into multiple form components for a unified copy experience

### API
| <div style="width: 17ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | - | - |
| className | Custom class name | `string` | - | - | - |
| **Data & Display** | | | | | |
| value | Value to copy | `string \| number \| boolean \| array \| object` | - | - | - |
| short | Truncate to first N characters for display; only applies to strings; full content is copied | `number` | `0` | - | - |
| showIcon | Whether to show the copy button icon | `boolean` | `false` | - | - |
| hiddenValue | Whether to hide the value; use with button-only display | `boolean` | `false` | - | - |
| children | Text content to display directly; takes priority over value | `node` | - | - | - |
| **Interaction Control** | | | | | |
| disabled | Whether to disable copy functionality | `boolean` | `false` | - | - |
| separator | Separator between values when copying | `string` | `','` | - | - |

### Examples

**Basic usage:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <CopyView value="hello world" />
    <CopyView value={123456} />
    <CopyView value={true} />
  </div>
);
```

**Show copy button:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <CopyView value="secret value" showIcon />
    <CopyView value="password123" hiddenValue />
    <CopyView value="public info" />
  </div>
);
```

**Text truncation:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <CopyView value="This is a very long text that will be truncated for display but copied in full" short={10} />
);
```

**Array handling:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <CopyView value={['Apple', 'Banana', 'Orange']} separator=" | " showIcon />
);
```

**Object handling:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => <CopyView value={{ id: 1, username: 'admin', role: 'Administrator' }} showIcon />;
```

**Custom display content:**

```jsx
import React from 'react';
import { Tag } from 'antd';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <CopyView value="https://example.com/api/key" showIcon>
    <Tag color="blue">API Key</Tag>
  </CopyView>
);
```

**Usage in tables:**

```jsx
import React from 'react';
import { Table } from 'antd';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

const dataSource = [
  { key: 1, id: 1001, email: 'alice@example.com' },
  { key: 2, id: 1002, email: 'bob@example.com' },
];

export default () => (
  <Table
    pagination={false}
    dataSource={dataSource}
    columns={[
      { title: 'User ID', dataIndex: 'id', render: (value) => <CopyView value={value} showIcon /> },
      { title: 'Email', dataIndex: 'email', render: (value) => <CopyView value={value} /> },
    ]}
  />
);
```

**Disabled state:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => <CopyView value="Read-only content" disabled showIcon />;
```

**Complex data handling:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <CopyView
    value={{
      user: { id: 1, name: 'John' },
      permissions: ['read', 'write'],
      config: { theme: 'dark', lang: 'zh' },
    }}
    showIcon
  />
);
```

**Integration with other components:**

```jsx
import React from 'react';
import { Space, Tag, Tooltip } from 'antd';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <Space>
    <Tag>Tag content</Tag>
    <Tooltip title="Click to copy full path">
      <CopyView value="/very/long/file/path/document.pdf" short={20} />
    </Tooltip>
  </Space>
);
```

**Error handling:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 8 }}>
    <CopyView value="" />
    <CopyView value={null} />
    <CopyView value={undefined} />
  </div>
);
```

### Usage in Form Components

CopyView is already integrated into multiple form components:

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { CopyView } = antdRestful;

export default () => (
  <div style={{ display: 'grid', gap: 8 }}>
    <CopyView value="rest-select: copy selected value when enableCopy is enabled" />
    <CopyView value="rest-tree-select: supports copying tree node paths" />
    <CopyView value="rest-cascader: supports copying cascader values with separator" />
  </div>
);
```

### Best Practices

1. **Sensitive information**: Use `hiddenValue` to hide sensitive content and show only the copy button
2. **Long text**: Use the `short` property to truncate display and keep the UI clean
3. **Array data**: Choose appropriate separators for readability
4. **Permission control**: Dynamically set the `disabled` property based on user permissions
5. **User experience**: Provide clear visual cues for important copy actions
6. **Accessibility**: Ensure the copy button has an appropriate aria-label

### FAQ

**Q: Why doesn't copy work?**
A: Check whether the browser supports the clipboard API, or whether the value is empty.

**Q: How do I customize the copy success message?**
A: The component uses Ant Design's message.success; configure globally via ConfigProvider.

**Q: The copied content format is wrong?**
A: Objects and arrays are automatically serialized; preprocess the value if a specific format is needed.
