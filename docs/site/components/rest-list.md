---
title: RestList
order: 3
---

## RestList

Remote data loading built on the Ant Design List component.

**Features:**

- Remote data loading: built on Ant Design List, loads data from RESTful API endpoints
- Static data support: besides remote loading, also accepts a static data source directly
- Two pagination modes: supports `loadMore` and `pagination` modes; `pagination` takes priority over `loadMore`
- Filter form: renders a GridForm filter form in the List header via `filterFormProps`
- Grid layout: supports antd List `grid` configuration and validates that `page_size` is a multiple of `grid.column`
- Flexible rendering: `renderItem` is exposed directly without wrapping List.Item; callers control rendering

### API


| <div style="width: 22ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| --- | --- | --- | --- | --- | --- |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through List `style` | - |
| className | Custom class name | `string` | - | Pass-through List `className` | - |
| **Data & Rendering** | | | | | |
| dataSource | Static data source; when set, remote loading via `restful` is not used | `array` | - | Overrides List `dataSource`; managed internally | - |
| renderItem | Custom list item render function; does not wrap List.Item | `function(item, index)` | - | Pass-through List `renderItem` | - |
| rowKey | Unique identifier field name for row data | `string` | `'id'` | Pass-through List `rowKey` | - |
| **Pagination & Layout** | | | | | |
| pagination | Pagination config; when set, enables pagination mode (takes priority over loadMore) | `boolean \| object` | - | Overrides List `pagination`; pagination logic wrapped internally | - |
| grid | List grid configuration; see grid options below | `object` | - | Pass-through List `grid`; adds column multiple validation | - |
| **Callbacks** | | | | | |
| onDataSourceChange | Callback when data source changes | `function({ dataSource, total })` | - | - | - |
| onFiltersChange | Callback when filter conditions change | `function(filters)` | - | - | - |
| **Remote Data Config** | | | | | |
| restful | RESTful API endpoint | `string` | - | - | - |
| reqConfig | Request configuration; extra axios request options | `object` | - | - | - |
| parseOptions | Options for parsing query params; [query-string](https://www.npmjs.com/package/query-string) configuration | `object` | - | - | - |
| baseParams | Base request parameters | `object` | - | - | - |
| routeParams | Route parameters | `object` | - | - | - |
| forceParams | Forced parameters that override route and form parameters | `object` | - | - | - |
| **Request Field Config** | | | | | |
| fieldPage | Pagination field name | `string` | `'page'` | - | - |
| fieldPageSize | Page size field name | `string` | `'page_size'` | - | - |
| defaultPageSize | Default page size | `number` | `20` | - | - |
| parseRowsPath | Path to parse data rows | `string` | `'results'` | - | - |
| parseTotalPath | Path to parse total count | `string` | `'count'` | - | - |
| **Control & Filtering** | | | | | |
| isActive | Whether active; does not fetch data when `false` | `boolean` | `true` | - | - |
| filterFormProps | Filter form configuration; see [GridForm](./grid-form.md). Filter form is rendered above the List (outside the List component) | `object` | - | - | - |
| loadMoreProps | Custom configuration for the load more area; see loadMoreProps options below | `object` | - | - | - |
| **Ant Design Native Config** | | | | | |
| antdListProps | Remaining Ant Design [List](https://ant.design/components/list-cn) props. Note: `loading` / `loadMore` / `pagination` / `dataSource` / `renderItem` / `rowKey` are managed by RestList internally and will be overridden if set here | `object` | - | Pass-through remaining props | - |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) props for the outer container; controls spacing between filter form and list | `object` | - | Pass-through Space props | - |


**loadMoreProps options:**


| <div style="width: 22ch;">Property</div> | Description | Type | Default |
| --- | --- | --- | --- |
| style | Custom container style for the load more area; merged with default styles | `object` | `{ textAlign: 'center', marginTop: 12, marginBottom: 12 }` |
| text | Custom button label | `string` | `'Load More'` |
| render | Fully custom render function; when set, `style` and `text` are ignored | `function(fetchMore, loadingMore, hasMore)` | - |


**grid options:**


| <div style="width: 22ch;">Property</div> | Description              | Type       | Default |
| ------ | --------------- | -------- | --- |
| gutter | Grid gutter spacing            | `number` | -   |
| column | Number of columns              | `number` | -   |
| xs     | Columns displayed at `<576px`  | `number` | -   |
| sm     | Columns displayed at `≥576px`  | `number` | -   |
| md     | Columns displayed at `≥768px`  | `number` | -   |
| lg     | Columns displayed at `≥992px`  | `number` | -   |
| xl     | Columns displayed at `≥1200px` | `number` | -   |
| xxl    | Columns displayed at `≥1600px` | `number` | -   |


> **Note:** When `grid` is configured, `defaultPageSize` (or the `page_size` passed via params) **must be a multiple of `grid.column`**, otherwise a `console.error` warning is logged.

**pagination configuration:**


| Value            | Description                                                                             |
| ------------ | ------------------------------------------------------------------------------ |
| `false` / not set | Uses loadMore mode; data accumulates on each load                                                     |
| `true`       | Enables pagination with default config (showSizeChanger, showQuickJumper, showTotal)                        |
| `object`     | Enables pagination; accepts antd [Pagination](https://ant.design/components/pagination-cn) configuration |


> **Priority:** `pagination` takes priority over `loadMore`. When pagination is enabled, the loadMore button is not rendered.

**Ref methods:**


| Method           | Description                     | Parameters  | Return Value                     |
| ------------- | ---------------------- | --- | ----------------------- |
| refreshList   | Refresh list data                 | -   | -                       |
| fetchMore     | Manually trigger load more (in loadMore mode) | -   | -                       |
| getDataSource | Get current data source                | -   | `{ dataSource, total }` |


**Static properties:**


| Property              | Description                   |
| --------------- | -------------------- |
| `RestList.Item` | Equivalent to `List.Item` for convenience |


### Examples

**loadMore mode (default):**

```jsx
import antdRestful from 'antd-restful';
const { RestList } = antdRestful;

const LoadMoreList = () => (
  <RestList
    restful="https://dummyjson.com/users"
    parseRowsPath="users"
    parseTotalPath="total"
    fieldPage="skip"
    fieldPageSize="limit"
    defaultPageSize={10}
    rowKey="id"
    filterFormProps={{
      fields: [
        { key: 'search', label: 'Search', type: 'input' },
      ],
    }}
    renderItem={(item) => (
      <RestList.Item>
        <RestList.Item.Meta
          title={item.firstName}
          description={item.email}
        />
      </RestList.Item>
    )}
  />
);
export default LoadMoreList;
```

**pagination mode:**

```jsx
import antdRestful from 'antd-restful';
const { RestList } = antdRestful;

const PaginationList = () => (
  <RestList
    restful="https://dummyjson.com/users"
    parseRowsPath="users"
    parseTotalPath="total"
    fieldPage="skip"
    fieldPageSize="limit"
    defaultPageSize={10}
    rowKey="id"
    pagination={{ showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
    renderItem={(item) => (
      <RestList.Item>
        <RestList.Item.Meta
          title={item.firstName}
          description={item.email}
        />
      </RestList.Item>
    )}
  />
);
export default PaginationList;
```

**Grid card layout:**

```jsx
import { Card, Tag } from 'antd';
import antdRestful from 'antd-restful';
const { RestList } = antdRestful;

// page_size=4 is a multiple of column=2, layout is correct
const GridCardList = () => (
  <RestList
    restful="https://dummyjson.com/products"
    parseRowsPath="products"
    parseTotalPath="total"
    fieldPage="skip"
    fieldPageSize="limit"
    defaultPageSize={4}
    rowKey="id"
    grid={{ gutter: 16, column: 2 }}
    renderItem={(item) => (
      <RestList.Item style={{ height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <p>Name: {item.title}</p>
          <p>Price: ¥{item.price}</p>
        </Card>
      </RestList.Item>
    )}
  />
);
export default GridCardList;
```

**Using with RouteBaseTable (route sync + pagination):**

> RouteBaseTable + viewType="list" is generally used with pagination; not recommended with loadMore.
> In loadMore mode, data accumulates and cannot be restored from URL parameters.

```jsx
import antdRestful from 'antd-restful';
import { useLocation, useNavigate } from 'react-router';

const { RestList, RouteBaseTable, constants } = antdRestful;
const { ViewType, FieldType } = constants;

const RouteListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RouteBaseTable
      viewType={ViewType.LIST}
      location={location}
      onSearchChange={(search) => {
        navigate(`${location.pathname}${search}`);
      }}
      restProps={{
        restful: "https://dummyjson.com/users",
        parseRowsPath: "users",
        parseTotalPath: "total",
        fieldPage: "skip",
        fieldPageSize: "limit",
        defaultPageSize: 10,
        rowKey: 'id',
        pagination: true,
        filterFormProps: {
          fields: [
            { key: 'search', label: 'Search', type: FieldType.INPUT },
          ],
        },
        renderItem: (item) => (
          <RestList.Item>
            <RestList.Item.Meta
              title={item.firstName}
              description={item.email}
            />
          </RestList.Item>
        ),
      }}
    />
  );
};
export default RouteListPage;
```

### Pagination Mode Comparison


| Feature                | loadMore (default)        | pagination                |
| ----------------- | ------------------- | ------------------------- |
| Data management              | Data accumulates with each load         | Data replaced on each page change                |
| Use case              | Feeds, waterfall layouts, content discovery        | Precise navigation, search results, admin lists            |
| Route sync              | Not recommended; accumulated data cannot be restored from URL | Recommended; page/pageSize can map to URL |
| With RouteBaseTable | Not recommended                 | Recommended                        |
| User perception              | "Load More" button            | Page navigator                     |


### FAQ

1. **Incomplete last row in grid layout**

When `page_size` is not a multiple of `grid.column`, the last row has fewer cards and the layout misaligns. The component logs an error:

```
[RestList] restful="/api/users/" page_size=3 must be a multiple of grid.column=2; current value does not satisfy this and will cause layout misalignment.
```

Ensure `defaultPageSize` (or `baseParams.page_size`) is a multiple of `grid.column`.

1. **Can pagination and loadMore be used together?**

antd List technically allows both `loadMore` and `pagination`, but their data management logic conflicts (one accumulates, one replaces on page change). RestList handles this with mutual exclusion: **pagination takes priority over loadMore**; when pagination is enabled, the loadMore button is not rendered.

1. **Inconsistent grid card heights**

When using grid layout, set `style={{ height: '100%' }}` on both `RestList.Item` and the inner `Card` to ensure cards in the same row align in height.
