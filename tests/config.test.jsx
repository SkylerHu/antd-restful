import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import globalConfig, { restOptions, setGlobalConfig, setRestOptions } from "src/config";

// 创建一个用于测试默认参数的简单组件
const TestComponent = ({
  pageKey = restOptions.fieldPage, // eslint-disable-line react/prop-types
  pageSizeKey = restOptions.fieldPageSize, // eslint-disable-line react/prop-types
  searchKey = restOptions.searchKey, // eslint-disable-line react/prop-types
}) => {
  return (
    <div data-testid="test-container">
      <span data-testid="page">{pageKey}</span>
      <span data-testid="pageSize">{pageSizeKey}</span>
      <span data-testid="search">{searchKey}</span>
    </div>
  );
};

describe("globalConfig 测试", () => {
  // 保存原始配置以便恢复
  const originalRestOptions = { ...restOptions };
  const originalGlobalConfig = { ...globalConfig };

  afterEach(() => {
    // 每次测试后恢复原始配置
    setRestOptions(originalRestOptions);
    setGlobalConfig(originalGlobalConfig);
  });

  it("默认 restOptions 配置正确", () => {
    expect(restOptions.fieldPage).toBe("page");
    expect(restOptions.fieldPageSize).toBe("page_size");
    expect(restOptions.searchKey).toBe("search");
    expect(restOptions.defaultPageSize).toBe(20);
  });

  it("调用 setRestOptions 可以局部更新 restOptions", () => {
    setRestOptions({
      fieldPage: "current",
      defaultPageSize: 50,
    });

    // 验证被更新的值
    expect(restOptions.fieldPage).toBe("current");
    expect(restOptions.defaultPageSize).toBe(50);

    // 验证未被更新的值仍然保留原有默认值
    expect(restOptions.fieldPageSize).toBe("page_size");
    expect(restOptions.searchKey).toBe("search");
  });

  it("调用 setGlobalConfig 可以局部更新 globalConfig", () => {
    const customStringify = () => "custom-string";
    const customParse = () => ({ custom: "parse" });

    setGlobalConfig({
      queryStringify: customStringify,
      queryParse: customParse,
    });

    // 验证被更新的序列化方法
    expect(globalConfig.queryStringify({ test: 1 })).toBe("custom-string");
    expect(globalConfig.queryParse("test=1")).toEqual({ custom: "parse" });
  });

  it("在组件中默认参数动态获取全球配置", () => {
    // 第一步：渲染组件，验证初始默认值
    const { rerender } = render(<TestComponent />);
    expect(screen.getByTestId("page")).toHaveTextContent("page");
    expect(screen.getByTestId("pageSize")).toHaveTextContent("page_size");
    expect(screen.getByTestId("search")).toHaveTextContent("search");

    // 第二步：修改全局配置
    setRestOptions({
      fieldPage: "pageNum",
      searchKey: "q",
    });

    // 第三步：强制组件重新渲染，验证新的默认值生效
    rerender(<TestComponent />);
    expect(screen.getByTestId("page")).toHaveTextContent("pageNum");
    expect(screen.getByTestId("search")).toHaveTextContent("q");
    // 未修改的配置项应该不变
    expect(screen.getByTestId("pageSize")).toHaveTextContent("page_size");
  });
});
