import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, List, Space, Spin } from "antd";
import { dequal as deepEqual } from "dequal";
import { DEFAULT_PAGE, FieldType } from "../common/constants";
import { getSpaceDirectionProps } from "../common/versionUtil";
import { clearEmptyValue, findDataByPath, genColumnKey, genFields, handleFormValues } from "../common/parser";
import { isArray, isEmpty, isFunction } from "../common/typeTools";
import GridForm from "./GridForm";
import globalConfig, { restOptions } from "../config";
import { useDeepCompareMemoize, useDictState } from "../hooks/index";
import { useSafeRequest } from "../requests";

const REFRESH_COUNTER_KEY = "____list_refresh";

const RestList = forwardRef(
  (props, ref) => {
    const {
      style,
      className,

      restful,
      reqConfig,
      parseOptions,
      baseParams,
      routeParams,
      forceParams,
      fieldPage = restOptions.fieldPage,
      fieldPageSize = restOptions.fieldPageSize,
      defaultPageSize = restOptions.defaultPageSize,
      parseRowsPath = restOptions.parseRowsPath,
      parseTotalPath = restOptions.parseTotalPath,
      isActive = true,
      onDataSourceChange,
      onFiltersChange,

      rowKey = restOptions.rowKey,
      dataSource,
      renderItem,
      grid,
      pagination,
      antdListProps,
      antdSpaceProps,
      filterFormProps,
      loadMoreProps,
    } = props;
    const spaceProps = getSpaceDirectionProps(antdSpaceProps);
    const resolvedRef = ref;
    const [makeRequest] = useSafeRequest();
    const reqConfigRef = useRef(reqConfig);
    const memParseOptions = useDeepCompareMemoize(parseOptions);

    const usePagination = !!pagination;

    const [loading, setLoading] = useState(!!(isActive && restful));
    const [loadingMore, setLoadingMore] = useState(false);

    const [innerData, setInnerData] = useState({
      total: 0,
      dataSource: [],
    });

    const filterFormRef = useRef();

    const memBaseParams = useDeepCompareMemoize(baseParams);
    const memRouteParams = useDeepCompareMemoize(routeParams);
    const memForceParams = useDeepCompareMemoize(forceParams);
    const [innerFilters, setInnerFilters] = useState({});

    const [filterFieldKeys] = useState([]);
    const formFiltersRef = useRef({});
    const [filterState, setFilterState] = useDictState({
      formFilters: {},
      paginationFilters: {},
    });

    const filterFields = useMemo(() => {
      const fields = genFields(filterFormProps?.fields, filterFieldKeys);
      fields?.forEach((field) => {
        if ([FieldType.NUMBER_RANGE, FieldType.DATE_RANGE_PICKER].includes(field.type)) {
          field.antdFieldProps = {
            defaultEmptyValue: "",
            ...field.antdFieldProps,
          };
        }
      });
      return fields;
    }, [filterFieldKeys, filterFormProps?.fields]);

    useEffect(() => {
      if (isArray(dataSource)) {
        setInnerData((oldV) => {
          const newV = { dataSource, total: dataSource?.length };
          return deepEqual(oldV, newV) ? oldV : newV;
        });
      }
    }, [dataSource]);

    useEffect(() => {
      if (isFunction(onDataSourceChange)) {
        onDataSourceChange(innerData);
      }
    }, [innerData, onDataSourceChange]);

    const pageSize = useMemo(() => {
      return parseInt(innerFilters[fieldPageSize] || defaultPageSize);
    }, [innerFilters, fieldPageSize, defaultPageSize]);

    const pageNumber = useMemo(() => {
      return parseInt(innerFilters[fieldPage] || DEFAULT_PAGE);
    }, [innerFilters, fieldPage]);

    // 判断过滤条件是否初始化
    const filtersInited = useMemo(() => innerFilters[fieldPage] && innerFilters[fieldPageSize], [innerFilters, fieldPage, fieldPageSize]);

    useEffect(() => {
      if (!pageSize || !filtersInited) {
        return;
      }
      const timer = setTimeout(() => {
        const column = grid?.column;
        if (column && column > 0 && pageSize % column !== 0) {
          console.warn( // eslint-disable-line no-console
            `[RestList] restful="${restful}" page_size=${pageSize} 必须是 grid.column=${column} 的倍数，当前不满足会导致列表布局不对齐。`
          );
        }
      }, 1000);
      return () => clearTimeout(timer);
    }, [grid?.column, pageSize, restful, filtersInited]);

    useEffect(() => {
      const oldV = formFiltersRef.current;
      const values = {};
      filterFields?.forEach((field) => {
        let v = undefined;
        v = oldV ? oldV[field.key] : undefined;
        if (v !== null && v !== "") {
          v = memRouteParams ? memRouteParams[field.key] : undefined;
          if (v === undefined) {
            v = memBaseParams ? memBaseParams[field.key] : undefined;
          }
        }
        values[field.key] = v;
      });
      delete values[fieldPage];
      delete values[fieldPageSize];

      let newV = handleFormValues(values, filterFields);
      if (!deepEqual(oldV, newV)) {
        setFilterState({ formFilters: newV });
      }
    }, [memRouteParams, memBaseParams, filterFields, fieldPage, fieldPageSize, setFilterState]);

    useEffect(() => {
      const formFilters = filterState.formFilters;
      filterFormRef.current?.getFormInstance()?.setFieldsValueAndActiveKey(formFilters);
    }, [filterState.formFilters]);

    useEffect(() => {
      setInnerFilters((oldV) => {
        let newV = {
          ...memBaseParams,
          ...memRouteParams,
          ...filterState.paginationFilters,
          ...filterState.formFilters,
          ...memForceParams,
        };
        newV[fieldPage] = parseInt(newV[fieldPage]) || DEFAULT_PAGE;
        newV[fieldPageSize] = parseInt(newV[fieldPageSize]) || defaultPageSize;
        newV = clearEmptyValue(newV);
        if (deepEqual(oldV, newV)) {
          return oldV;
        }
        return newV;
      });
    }, [fieldPage, fieldPageSize, defaultPageSize, memBaseParams, memRouteParams, memForceParams, filterState]);

    useEffect(() => {
      if (!filtersInited) {
        return;
      }
      if (isFunction(onFiltersChange)) {
        const filters = { ...innerFilters };
        delete filters[REFRESH_COUNTER_KEY];
        if (filters[fieldPage] === DEFAULT_PAGE) {
          delete filters[fieldPage];
        }
        if (memBaseParams && memBaseParams[fieldPageSize]) {
          if (filters[fieldPageSize] === memBaseParams[fieldPageSize]) {
            delete filters[fieldPageSize];
          }
        } else {
          if (filters[fieldPageSize] === defaultPageSize) {
            delete filters[fieldPageSize];
          }
        }
        if (memForceParams) {
          Object.keys(memForceParams).forEach((key) => {
            delete filters[key];
          });
        }
        if (memBaseParams) {
          Object.keys(memBaseParams).forEach((key) => {
            if (deepEqual(filters[key], memBaseParams[key])) {
              delete filters[key];
            }
          });
        }
        onFiltersChange(filters);
      }
    }, [fieldPage, fieldPageSize, defaultPageSize, memBaseParams, memForceParams, innerFilters, onFiltersChange, filtersInited]);

    const currentPageRef = useRef(DEFAULT_PAGE);

    const doFetch = useCallback(
      (page, append = false) => {
        if (!isActive || !restful) {
          return;
        }
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        const params = { ...innerFilters, [fieldPage]: page };
        delete params[REFRESH_COUNTER_KEY];
        const _config = {
          params,
          ...reqConfigRef.current,
        };
        if (memParseOptions) {
          _config.paramsSerializer = (p) => globalConfig.queryStringify(p, memParseOptions);
        }
        makeRequest({ delay: append ? 0 : 200, key: append ? "restlist-more" : "restlist" })
          .get(restful, _config)
          .then((response) => {
            const data = findDataByPath(response.data, parseRowsPath);
            const _total = findDataByPath(response.data, parseTotalPath);
            currentPageRef.current = page;
            if (append) {
              setInnerData((prev) => ({
                dataSource: [...prev.dataSource, ...(data || [])],
                total: _total || prev.total,
              }));
            } else {
              setInnerData({ dataSource: data || [], total: _total || 0 });
            }
          })
          .finally(() => {
            if (append) {
              setLoadingMore(false);
            } else {
              setLoading(false);
            }
          });
      },
      [isActive, makeRequest, restful, parseRowsPath, parseTotalPath, innerFilters, memParseOptions, fieldPage]
    );

    const fetchData = useCallback(() => {
      if (!filtersInited) {
        return;
      }
      if (usePagination) {
        doFetch(pageNumber);
      } else {
        currentPageRef.current = DEFAULT_PAGE;
        doFetch(DEFAULT_PAGE);
      }
    }, [usePagination, doFetch, pageNumber, filtersInited]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const fetchMore = useCallback(() => {
      doFetch(currentPageRef.current + 1, true);
    }, [doFetch]);

    const hasMore = useMemo(() => {
      return innerData.dataSource.length < innerData.total;
    }, [innerData.dataSource.length, innerData.total]);

    useImperativeHandle(
      resolvedRef,
      () => ({
        refreshList: fetchData,
        fetchMore,
        getDataSource: () => innerData,
      }),
      [fetchData, fetchMore, innerData]
    );

    // pagination 优先级高于 loadMore：当 pagination 启用时，loadMore 不渲染
    const loadMoreView = useMemo(() => {
      if (usePagination || !restful || !hasMore) {
        return null;
      }
      if (isFunction(loadMoreProps?.render)) {
        return loadMoreProps.render(fetchMore, loadingMore, hasMore);
      }
      return (
        <div style={{ textAlign: "center", marginTop: 12, marginBottom: 12, ...loadMoreProps?.style }}>
          <Button onClick={fetchMore} loading={loadingMore}>
            {loadMoreProps?.text || "加载更多"}
          </Button>
        </div>
      );
    }, [usePagination, restful, hasMore, fetchMore, loadingMore, loadMoreProps]);

    const paginationConfig = useMemo(() => {
      if (!usePagination) {
        return false;
      }
      const paginationProps = pagination === true ? {} : pagination;
      const _config = {
        size: "small",
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => <span>总计：{total} 条</span>,
        ...paginationProps,
        current: pageNumber,
        pageSize,
        total: restful ? innerData.total : undefined,
        onChange: (page, newPageSize) => {
          setFilterState({
            paginationFilters: {
              ...filterState.paginationFilters,
              [fieldPage]: page,
              [fieldPageSize]: newPageSize,
            },
          });
          if (isFunction(paginationProps?.onChange)) {
            paginationProps.onChange(page, newPageSize);
          }
        },
      };
      return _config;
    }, [
      usePagination,
      pagination,
      pageSize,
      pageNumber,
      innerData.total,
      restful,
      fieldPage,
      fieldPageSize,
      filterState.paginationFilters,
      setFilterState,
    ]);

    const hasHeader = useMemo(() => {
      return restful && !isEmpty(filterFormProps);
    }, [filterFormProps, restful]);

    const headerView = useMemo(() => {
      if (!hasHeader) {
        return undefined;
      }
      return (
        <GridForm
          key="filterForm"
          submitTitle="搜索"
          {...filterFormProps}
          fields={filterFields}
          initialValues={{ ...memBaseParams, ...filterFormProps?.initialValues }}
          ref={filterFormRef}
          onSubmit={(values) => {
            const newV = { ...values };
            formFiltersRef.current = newV;
            setFilterState({
              paginationFilters: {
                ...filterState.paginationFilters,
                [fieldPage]: 1,
                [REFRESH_COUNTER_KEY]: (filterState.paginationFilters[REFRESH_COUNTER_KEY] || 0) + 1,
              },
              formFilters: newV,
            });
          }}
          onReset={(values) => {
            const newV = { ...values };
            filterFormProps?.fields?.forEach((field) => {
              const key = genColumnKey(field);
              if (!filterFieldKeys.includes(key)) {
                newV[key] = null;
              }
            });
            formFiltersRef.current = newV;
            setFilterState({
              paginationFilters: {
                ...filterState.paginationFilters,
                [fieldPage]: 1,
                [REFRESH_COUNTER_KEY]: (filterState.paginationFilters[REFRESH_COUNTER_KEY] || 0) + 1,
              },
              formFilters: newV,
            });
          }}
        />
      );
    }, [
      hasHeader,
      filterFormProps,
      filterFields,
      memBaseParams,
      filterFieldKeys,
      filterState.paginationFilters,
      fieldPage,
      setFilterState,
    ]);

    return (
      <Spin spinning={loading && !loadingMore}>
        <Space
          {...antdSpaceProps}
          {...spaceProps}
          style={{ width: "100%", ...antdSpaceProps?.style }}
        >
          {headerView}
          <List
            style={style}
            className={className}
            grid={grid}
            {...antdListProps}
            loadMore={loadMoreView}
            pagination={paginationConfig}
            rowKey={rowKey}
            dataSource={innerData.dataSource}
            renderItem={renderItem}
          />
        </Space>
      </Spin>
    );
  }
);

RestList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,

  restful: PropTypes.string,
  reqConfig: PropTypes.object,
  parseOptions: PropTypes.object,
  baseParams: PropTypes.object,
  routeParams: PropTypes.object,
  forceParams: PropTypes.object,
  fieldPage: PropTypes.string,
  fieldPageSize: PropTypes.string,
  defaultPageSize: PropTypes.number,
  parseRowsPath: PropTypes.string,
  parseTotalPath: PropTypes.string,
  isActive: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onDataSourceChange: PropTypes.func,

  rowKey: PropTypes.string,
  dataSource: PropTypes.array,
  renderItem: PropTypes.func,
  grid: PropTypes.shape({
    gutter: PropTypes.number,
    column: PropTypes.number,
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    xxl: PropTypes.number,
  }),
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  filterFormProps: PropTypes.object,
  antdListProps: PropTypes.object,
  antdSpaceProps: PropTypes.object,
  loadMoreProps: PropTypes.shape({
    style: PropTypes.object,
    text: PropTypes.string,
    render: PropTypes.func,
  }),
};
RestList.displayName = "RestList";
RestList.Item = List.Item;

export default RestList;
