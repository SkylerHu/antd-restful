import { queryString } from "./common/parser";

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

export const textOptions = {
  // 下拉、自动补全等无数据时的默认文案
  notFoundContent: "暂无数据",
  // 常用按钮文案（一级配置，btn前缀）
  btnSubmitTitle: "查询",
  btnResetTitle: "重置",
  btnCancelTitle: "取消",
};

export const setTextOptions = (options = {}) => {
  Object.assign(textOptions, options);
};

const globalConfig = {
  queryStringify: (params, options) => queryString.stringify(params, options),
  queryParse: (params, options) => queryString.parse(params, options),
  textOptions,
};

export const setGlobalConfig = (config = {}) => {
  Object.assign(globalConfig, config);
};

export default globalConfig;