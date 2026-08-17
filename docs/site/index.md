# Configurable RESTful Data Components for Ant Design

This library is built on React + Ant Design and provides an out-of-the-box, data-driven component system centered around RESTful APIs. It covers table and list display, filter form integration, pagination and sorting, two-way route parameter sync, request cancellation, error handling, and other common capabilities. Declarative configuration lets you wire up APIs and orchestrate interactions, with field parsing, formatting, validation, and various form sub-components. It handles differences across antd4/5/6 date libraries and component APIs, making it suitable for admin panels, operations systems, and dynamic JSON configuration scenarios.

## Core Features

- Out-of-the-box RESTful data components: `RestTable`, `RestList`, `RouteBaseTable`
- Configurable filtering and form integration: `GridForm` + various `formitems`
- Pagination, sorting, filtering, and two-way route parameter sync
- Built-in request wrapper, request cancellation, error handling, and utilities
- Compatible with common usage differences across antd4/5/6

## Compatibility

- `antd >= 4.24` (antd5 and antd6 test flows covered)
- `@ant-design/icons >= 4`
- `react/react-dom >= 16`

## Installation

```bash
npm install antd-restful
npm install react react-dom antd @ant-design/icons axios
```

Optional date library dependencies (choose one based on your `antd` version):

```bash
# Recommended for antd v5/v6
npm install dayjs

# Recommended for antd v4
npm install moment
```

If your project uses a lower Node version such as Node 12, install the `0.x` compatibility release:

```bash
npm install antd-restful@compat
# Or pin a specific version
npm install antd-restful@0.5.0
```

The compatibility release uses a slightly different import style:

```js
import * as antdRestful from "antd-restful";
```

## Quick Start

```jsx | pure
import antdRestful from "antd-restful";

const { RestTable } = antdRestful;

export default function UserList() {
  return (
    <RestTable
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      baseParams={{ limit: 10 }}
      columns={[{ title: "Name", dataIndex: "firstName" }]}
      rowKey="id"
    />
  );
}
```

> If your backend is Django REST framework (default `results/count/page/page_size`), you can omit the parsing configuration above;
> for other response shapes, set `parseRowsPath`, `parseTotalPath`, and pagination field mappings according to your API format.

## Documentation Navigation

### Home

- [Home (current)](./index.md)

### Components

- [Components Overview](./components/overview.md)
- [RouteBaseTable](./components/route-base-table.md)
- [RestTable](./components/rest-table.md)
- [RestList](./components/rest-list.md)
- [GridForm](./components/grid-form.md)
- [LongText](./components/long-text.md)
- [CopyView](./components/copy-view.md)

### Form Items

- [Form Items Overview](./formitems/overview.md)
- [RestSelect](./formitems/rest-select.md)
- [TableSelect](./formitems/table-select.md)
- [RestAutoComplete](./formitems/rest-auto-complete.md)
- [RestCascader](./formitems/rest-cascader.md)
- [RestTreeSelect](./formitems/rest-tree-select.md)
- [UploadView](./formitems/upload-view.md)
- [DateStrPicker](./formitems/date-str-picker.md)
- [RangeStrPicker](./formitems/range-str-picker.md)
- [ExpansionView](./formitems/expansion-view.md)
- [NumberRange](./formitems/number-range.md)
- [CompareEdit](./formitems/compare-edit.md)
- [MentionView](./formitems/mention-view.md)

### Tools & Hooks

- [Tools Overview](./tools/overview.md)
- [Configuration](./tools/config.md)
- [Request Module](./tools/requests.md)
- [Hooks](./tools/hooks.md)
- [Type Utilities](./tools/type-tools.md)
- [Validators](./tools/validators.md)

### Other

- [FAQ](./faq/index.md)
- [Changelog](./changelog/index.md)
- [GitHub Repository](https://github.com/skylerhu/antd-restful)
