import { queryString } from "src/common/parser";

export const restOptions = {
  // 默认对照后端 Django REST framework (DRF) 框架设置
  // 分页请求参数: 当前页码字段
  fieldPage: "page",
  // 分页请求参数: 每页数量字段
  fieldPageSize: "page_size",
  // 列表检索的搜索关键字字段
  searchKey: "search",
  // 排序字段
  fieldOrdering: "ordering",
  // 接口返回列表数据所在的对象路径 (DRF 默认返回 { count: 0, results: [] })
  parseRowsPath: "results",
  // 接口返回总条数所在的对象路径
  parseTotalPath: "count",
  // 数组元素多选时的连接符
  separator: ",",
  // 默认的分页大小
  defaultPageSize: 20,
  // 列表/表格的默认主键字段
  rowKey: "id",
  // 树形或级联结构默认的父节点字段
  fieldParent: "parent",
};

export const setRestOptions = (options = {}) => {
  Object.assign(restOptions, options);
};

const globalConfig = {
  queryStringify: (params, options) => queryString.stringify(params, options),
  queryParse: (params, options) => queryString.parse(params, options),
};

export const setGlobalConfig = (config = {}) => {
  Object.assign(globalConfig, config);
};

export default globalConfig;