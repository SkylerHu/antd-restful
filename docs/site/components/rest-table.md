---
title: RestTable
order: 2
---

## RestTable
基于 Ant Design Table 组件实现了远程加载数据。

**功能特性：**
- 远程数据加载：基于 Ant Design Table 组件实现，支持从 RESTful API 接口加载数据
- 静态数据支持：除了远程加载，也支持直接传入静态数据源
- 模板支持：支持 {field} 格式的标签模板
- 多种筛选类型：支持输入框、下拉选择、数字输入、数字范围、日期范围等筛选方式
- 灵活配置：高度可配置的列定义和表格行为
- 工具栏功能：内置高级搜索、刷新、下载、列显示设置等工具
- 智能筛选：支持表头筛选和表单筛选，自动处理参数合并
- 本地存储：支持列显示设置的本地存储
- 自动刷新：支持间隔自动刷新数据
- 展开行支持：支持配置展开行以 Descriptions 形式展示详细信息

### 参数说明
| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | 透传 Table `style` | - |
| className | 自定义类名 | `string` | - | 透传 Table `className` | - |
| **远程数据相关** | | | | | |
| restful | RESTful API 接口地址，支持相对地址（如 `/api/users`）和绝对地址（如 `https://dummyjson.com/users`） | `string` | - | - | - |
| reqConfig | 请求配置，axios请求的额外配置 | `object` | - | - | - |
| parseOptions | 解析query参数的选项, [query-string](https://www.npmjs.com/package/query-string) 的配置项 | `object` | - | - | 0.1.14 |
| urlDetailTemplate | 删除操作的自定义 URL 模板 | `string` | - | - | - |
| baseParams | 基础请求参数 | `object` | - | - | - |
| routeParams | 路由参数 | `object` | - | - | - |
| forceParams | 强制参数，会覆盖路由参数和表单参数 | `object` | - | - | - |
| fieldPage | 分页字段名 | `string` | `'page'` | - | - |
| fieldPageSize | 每页条数字段名 | `string` | `'page_size'` | - | - |
| defaultPageSize | 默认页数 | `number` | `20` | - | - |
| fieldOrdering | 排序字段名 | `string` | `'ordering'` | - | - |
| parseRowsPath | 解析数据行的路径 | `string` | `'results'` | - | - |
| parseTotalPath | 解析总数的路径 | `string` | `'count'` | - | - |
| showHeaderTags | 是否显示表格header上的筛选条件 | `boolean` | `false` | - | 0.1.5 |
| **显示和交互** | | | | | |
| isActive | 是否激活，为 false 时不更新数据 | `boolean` | `true` | - | - |
| tools | 工具栏配置 | `object \| boolean` | `true` | - | - |
| extraTools | 其他操作工具 | `node` | - | - | 0.1.9 |
| onFiltersChange | 筛选条件变化回调 | `function(filters)` | - | - | - |
| onDataSourceChange | 数据源变化回调 | `function(dataSource)` | - | - | - |
| rowKey | 行数据的 key | `string` | `'id'` | 透传 Table `rowKey` | - |
| columns | 表格列配置 | `array` | - | 覆盖 Table `columns`，内部增强处理 | - |
| dataSource | 静态数据源，设置后不使用 restful | `array` | - | 覆盖 Table `dataSource`，由内部管理 | - |
| expandFieldPath | 根据字段路径判断是否使用展开，不配置字段默认根据 columns 的配置展示 | `string` | - | - | 0.1.9 |
| expandAntdProps | 展开列使用 Descriptions 展示，配置其 props | `object` | - | 透传 Descriptions 属性 | 0.1.9 |
| expandedAllRows | 未启用 tools 时也可以配置展开所有行 | `boolean` | - | - | 0.1.9 |
| filterFormProps | 筛选表单配置，详见 [GridForm](./grid-form.md) | `object` | - | - | - |
| **Ant Design 原生配置** | | | | | |
| antdTableProps | Ant Design [Table](https://ant.design/components/table-cn) 组件的属性 | `object` | - | 透传 Table 属性，`loading` / `rowKey` / `columns` / `dataSource` / `pagination` / `onChange` / `expandable` 由内部管理 | - |
| antdSpaceProps | 外层容器 Ant Design [Space](https://ant.design/components/space-cn) 组件的属性 | `object` | - | 透传 Space 属性 | - |

**tools 配置项：**

| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| advancedSearch | 是否启用搜索字段设置能力，`string` 时作为存储 key | `boolean \| string` | `true` | - | - |
| refreshInterval | 刷新间隔（毫秒），0为手动刷新，>0为自动刷新，<0为隐藏刷新按钮 | `number` | `0` | - | - |
| downloadKey | 下载功能的参数名，true时使用'_download'，字符串时使用自定义参数名，false时禁用下载 | `boolean \| string` | `false` | - | - |
| settings | 列显示设置，true时使用restful作为存储key，字符串时使用自定义key，false时禁用 | `boolean \| string` | `true` | - | - |
| expandedAllRows | 控制是否默认展开所有行，为false时默认不展开 | `boolean` | - | - | 0.1.9 |

**columns 配置项：**

| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| title | 列标题 | `string` | - | 透传 Column `title` | - |
| dataIndex | 列数据在数据项中对应的路径 | `string` | - | 透传 Column `dataIndex` | - |
| key | 列的唯一标识 | `string` | - | 透传 Column `key` | - |
| labelTemplate | 列值显示模板，支持 `{field}` 格式 | `string` | - | - | - |
| copyProps | 开启复制功能的配置，详见 [CopyView](#copyview) | `object` | - | - | - |
| copyField | dataIndex配置的值是字典时，可以用此配置复制时使用的字段 | `string` | - | - | 0.1.9 |
| showTag | 是否按照 Tag 展示，数据为数组时有用 | `boolean` | - | - | - |
| filterDropdownConfig | 自定义筛选下拉框配置 | `object` | - | 覆盖 Column `filterDropdown` / `filterIcon` | - |
| dropdownLocalConfig | 前端Table筛选的配置 | `object` | - | - | - |
| filterMultiple | 是否支持多选筛选 | `boolean` | - | 透传 Column `filterMultiple` | - |
| fieldName | 本地筛选时使用的真实字段名 | `string` | - | - | - |
| hidden | 是否默认隐藏该列 | `boolean` | `false` | - | - |
| sorter | 排序配置 | `boolean \| function` | - | 透传 Column `sorter`，远程模式下内部管理 `sortOrder` | - |
| filters | 筛选选项 | `array` | - | 透传 Column `filters` | - |
| expandable | 是否在展开功能中显示 | `boolean` | - | - | 0.1.9 |
| expandableItemProps | 展示样式配置 | `object` | - | 透传 Descriptions.Item 属性 | 0.1.9 |
| render | 自定义渲染函数 | `function(text, record, index)` | - | 透传 Column `render` | - |

**filterDropdownConfig 配置项：**

| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| type | 筛选类型 | `'input' \| 'select' \| 'number' \| 'number-range' \| 'date-range-picker'` | - | - | - |
| style | 筛选下拉框的自定义样式 | `object` | - | - | - |
| antdSpaceProps | 控制输入组件和按钮的排列位置 | `object` | - | 透传 Space 属性 | - |
| dropdownProps | 下拉框组件的属性 | `object` | - | 透传对应筛选组件属性 | - |

**Ref 方法：**

| 方法名 | 说明 | 参数 | 返回值 |
| - | - | - | - |
| refreshList | 刷新表格数据 | - | - |
| deleteRow | 删除指定行 | `row` | - |

### 使用示例

**基本使用：**

```jsx
import React, { useRef } from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;

// 基本使用示例
const BasicTable = () => {
  const tableRef = useRef();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "firstName",
    },
    {
      title: "性别",
      dataIndex: "gender",
    },
    {
      title: "年龄",
      dataIndex: "age",
      render: (value, record) => `${value}岁`,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      copyProps: { showIcon: true },
    },
    {
      title: "城市",
      dataIndex: "address",
      labelTemplate: "城市：{city}",
    },
  ];

  return (
    <RestTable
      ref={tableRef}
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      columns={columns}
      rowKey="id"
      baseParams={{
        limit: 5,
      }}
      tools={{
        settings: "rest-table-basic",
      }}
      onFiltersChange={(filters) => {
        console.log('筛选条件变化:', filters);
      }}
      onDataSourceChange={(data) => {
        console.log('数据源变化:', data);
      }}
    />
  );
};

export default BasicTable;
```

**带筛选表单的表格：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;

const TableWithFilter = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "firstName",
    },
    {
      title: "性别",
      dataIndex: "gender",
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
  ];

  return (
    <RestTable
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      columns={columns}
      baseParams={{
        limit: 5,
      }}
      tools={{
        settings: "rest-table-filter",
      }}
      filterFormProps={{
        antdListProps: {
          grid: { gutter: 10, xs: 1, sm: 2, md: 3 }
        },
        fields: [
          {
            key: 'q',
            label: '关键词',
            type: FieldType.INPUT,
            antdFieldProps: {
              placeholder: '搜索用户名/姓名/邮箱'
            }
          }
        ]
      }}
    />
  );
};

export default TableWithFilter;
```

**本地数据表格：**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { RestTable } = antdRestful;

const LocalDataTable = () => {
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      fieldName: "name", // 用于本地筛选的字段名
      filters: [
        { text: "张三", value: "张三" },
        { text: "李四", value: "李四" },
      ],
    },
    {
      title: "年龄",
      dataIndex: "age",
      fieldName: "age",
      sorter: true, // 本地排序
    },
    {
      title: "城市",
      dataIndex: "city",
      fieldName: "city",
      filters: [
        { text: "北京", value: "北京" },
        { text: "上海", value: "上海" },
      ],
    },
  ];

  const dataSource = [
    { id: 1, name: '张三', age: 25, city: '北京' },
    { id: 2, name: '李四', age: 30, city: '上海' },
    { id: 3, name: '王五', age: 28, city: '北京' },
  ];

  return (
    <RestTable
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      tools={false} // 禁用工具栏
    />
  );
};

export default LocalDataTable;
```

**高级配置示例：**

```jsx
import React, { useRef } from 'react';
import antdRestful from 'antd-restful';
const { RestTable, constants: { FieldType } } = antdRestful;
import { Button, message, Space } from 'antd';

const AdvancedTable = () => {
  const tableRef = useRef();

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      copyProps: {
        showIcon: true,
        text: '复制用户名'
      },
    },
    {
      title: "公司信息",
      dataIndex: "company",
      labelTemplate: "{name} ({title})",
    },
    {
      title: "体重",
      dataIndex: "weight",
      render: (value) => `${Number(value ?? 0).toFixed(2)} kg`,
    },
    {
      title: "角色",
      dataIndex: "role",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    message.info(`查看用户: ${record.username}`);
  };

  const handleDelete = (record) => {
    if (tableRef.current) {
      tableRef.current.deleteRow(record);
    }
  };

  const handleRefresh = () => {
    if (tableRef.current) {
      tableRef.current.refreshList();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleRefresh}>手动刷新</Button>
      </div>

      <RestTable
        ref={tableRef}
        restful="https://dummyjson.com/users"
        parseRowsPath="users"
        parseTotalPath="total"
        fieldPage="skip"
        fieldPageSize="limit"
        urlDetailTemplate="https://dummyjson.com/users/{id}" // 自定义删除URL模板
        columns={columns}
        reqConfig={{
          timeout: 10000, // 10秒超时
          headers: {
            'Custom-Header': 'value'
          }
        }}
        tools={{
          advancedSearch: true,
          refreshInterval: 60000, // 1分钟自动刷新
          downloadKey: true,       // 使用默认的_download参数
          settings: "rest-table-advanced"
        }}
        baseParams={{
          limit: 5
        }}
        forceParams={{
          // 强制参数，不会被其他参数覆盖
          company_id: 123
        }}
        onFiltersChange={(filters) => {
          console.log('当前筛选条件:', filters);
        }}
        antdTableProps={{
          size: 'small',
          scroll: { x: 1000 },
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }
        }}
      />
    </div>
  );
};

export default AdvancedTable;
```

### 工具栏功能详解

**高级搜索切换：**
- 点击高级搜索按钮可以展开/收起筛选表单
- 当有多个筛选条件时，会自动展开高级搜索

**自动刷新：**
- `refreshInterval > 0` 时启用自动刷新
- 点击刷新按钮可以切换自动刷新的开启/关闭状态
- `refreshInterval = 0` 时为手动刷新模式
- `refreshInterval < 0` 时隐藏刷新按钮

**下载功能：**
- 支持当前页下载和全部数据下载
- 下载URL会自动添加当前的筛选和排序参数
- 可以自定义下载参数名

**列显示设置：**
- 支持显示/隐藏列的设置
- 设置会自动保存到localStorage
- 支持全选/反选操作
- 可以自定义存储key

### 筛选功能详解

**表头筛选：**
- 支持输入框和下拉选择两种类型
- 输入框支持模糊搜索
- 下拉选择支持远程数据加载
- 筛选值会自动同步到URL参数

**表单筛选：**
- 使用GridForm组件实现
- 支持所有GridForm的字段类型
- 可以在单项模式和高级搜索模式间切换

**本地筛选：**
- 当没有配置restful时，支持本地筛选和排序
- 需要配置fieldName指定真实的字段名
- 支持多种数据类型的筛选

### 最佳实践

1. **性能优化：**
   - 合理设置分页大小，避免一次加载过多数据
   - 使用forceParams避免不必要的参数变化
   - 对于大表格，考虑使用虚拟滚动

2. **用户体验：**
   - 合理配置工具栏功能，避免功能过载
   - 使用列显示设置让用户自定义显示内容
   - 提供清晰的筛选和排序反馈

3. **数据处理：**
   - 使用labelTemplate简化复杂数据的显示
   - 合理使用copyProps提升数据操作效率
   - 配置合适的解析路径适配不同的API响应格式

4. **错误处理：**
   - 配置合适的请求超时时间
   - 使用reqConfig添加必要的请求头
   - 实现数据变化的回调处理


### 常见问题

1. **工具栏遮挡了筛选表单中的字段**

有2种解决方式

1）不根据屏幕宽高动态设置列数，组件会根据 column 设置的列数兼容遮挡的场景：
```js
filterFormProps: {
  antdListProps: grid: { gutter: 30, column: 3 },
}
```

2）可以在 `filterFormProps.fields` 筛选配置最后增加一个占位的字段，例如
```js
{
  key: "__placeholder",
  label: "占位",
  tip: "搜索按钮被遮挡，可以勾选控制换行展示",
  hidden: true,
  antdFormItemProps: {
    hidden: true,
  },
}
```

2. **处理 query 参数在超大数值下丢失精度问题**
1）升级 `query-string > 9.1`，支持配置 `parseOptions.types` 指定字段类型  
2）若使用 `RouteBaseTable`，可通过 `parseTypes` 做兼容映射
```js
<RouteBaseTable
  location={location}
  onSearchChange={(query) => setSearchParams(query)}
  parseOptions={{
    parseNumbers: false,  // 关闭转换成数字
    // types: {  // required query-string > 9.1
    //   user: "number",
    // },
  }}
  parseTypes={{
    // 注意配置 string 无效，因为会先由 query-string 处理完 再使用 parseTypes 处理转成数字
    // 注意解决 parseOptions.parseNumbers = false 一起使用
    user: "number",
  }}
  ...
/>
```

