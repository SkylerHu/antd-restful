import { FieldType } from "src/common/constants";

function mockButton() {
  return null;
}
function mockInput() {
  return null;
}

function mockInputNumber() {
  return null;
}
function mockSpace() {
  return null;
}
function mockRow() {
  return null;
}
function mockCol() {
  return null;
}
function mockNumberRange() {
  return null;
}
function mockRangeStrPicker() {
  return null;
}
function mockRestSelect() {
  return null;
}

jest.mock("antd", () => {
  const { mockAntdVersion } = jest.requireActual("../test-utils/testVersion");
  return {
    version: mockAntdVersion,
    Button: mockButton,
    Col: mockCol,
    Descriptions: () => null,
    Dropdown: () => null,
    Input: mockInput,
    InputNumber: mockInputNumber,
    Row: mockRow,
    Space: mockSpace,
    Spin: () => null,
    Table: () => null,
    Tag: () => null,
    Tooltip: () => null,
  };
});

jest.mock("@ant-design/icons", () => ({
  CloseOutlined: () => null,
  DownloadOutlined: () => null,
  NodeExpandOutlined: () => null,
  ReloadOutlined: () => null,
  SearchOutlined: () => null,
  SecurityScanOutlined: () => null,
  SettingOutlined: () => null,
}));

jest.mock("src/components/formitems/NumberRange", () => ({
  __esModule: true,
  default: mockNumberRange,
}));

jest.mock("src/components/formitems/RangeStrPicker", () => ({
  __esModule: true,
  default: mockRangeStrPicker,
}));

jest.mock("src/components/formitems/RestSelect", () => ({
  __esModule: true,
  default: mockRestSelect,
}));

import { getColumnSearchProps } from "src/components/RestTable";

const collectElements = (node, matcher, acc = []) => {
  if (!node) return acc;
  if (Array.isArray(node)) {
    node.forEach((item) => collectElements(item, matcher, acc));
    return acc;
  }
  if (typeof node !== "object") {
    return acc;
  }
  if (matcher(node)) {
    acc.push(node);
  }
  collectElements(node.props?.children, matcher, acc);
  return acc;
};

describe("getColumnSearchProps branches", () => {
  test("handles input filter callbacks and open-focus logic", () => {
    const setSelectedKeys = jest.fn();
    const confirm = jest.fn();
    const clearFilters = jest.fn();

    const props = getColumnSearchProps(
      "name",
      {
        filterDropdownConfig: {
          type: FieldType.INPUT,
        },
      },
      null
    );

    const dropdown = props.filterDropdown({
      setSelectedKeys,
      selectedKeys: [],
      confirm,
      clearFilters,
    });

    const [inputEl] = collectElements(dropdown, (el) => el.type === mockInput);
    inputEl.props.onChange({ target: { value: "abc" } });
    expect(setSelectedKeys).toHaveBeenCalledWith(["abc"]);

    inputEl.props.onPressEnter();
    expect(confirm).toHaveBeenCalled();

    const buttons = collectElements(dropdown, (el) => el.type === mockButton);
    const resetButton = buttons.find((btn) => btn.props.children === "重置");
    const searchButton = buttons.find((btn) => btn.props.children === "搜索");
    resetButton.props.onClick();
    searchButton.props.onClick();
    expect(clearFilters).toHaveBeenCalled();
  });

  test("handles number filter onChange branches", () => {
    const setSelectedKeys = jest.fn();
    const confirm = jest.fn();
    const clearFilters = jest.fn();

    const props = getColumnSearchProps(
      "age",
      {
        filterDropdownConfig: {
          type: FieldType.NUMBER,
        },
      },
      null
    );

    const dropdown = props.filterDropdown({
      setSelectedKeys,
      selectedKeys: [],
      confirm,
      clearFilters,
    });

    const [numberEl] = collectElements(dropdown, (el) => el.type === mockInputNumber);
    numberEl.props.onChange(10);
    numberEl.props.onChange(undefined);
    numberEl.props.onPressEnter();

    expect(setSelectedKeys).toHaveBeenCalledWith([10]);
    expect(setSelectedKeys).toHaveBeenCalledWith([]);
    expect(confirm).toHaveBeenCalled();
    expect(clearFilters).not.toHaveBeenCalled();
  });

  test("returns undefined dropdown for unsupported filter type", () => {
    const props = getColumnSearchProps(
      "x",
      {
        filterDropdownConfig: {
          type: "unsupported",
        },
      },
      null
    );

    const dropdown = props.filterDropdown({
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
    });
    expect(dropdown).toBeUndefined();
  });

  test("handles number range and date range callbacks", () => {
    const setSelectedKeys = jest.fn();
    const confirm = jest.fn();
    const clearFilters = jest.fn();

    const numberRangeProps = getColumnSearchProps(
      "amount",
      {
        filterDropdownConfig: {
          type: FieldType.NUMBER_RANGE,
        },
      },
      null
    );
    const numberRangeDropdown = numberRangeProps.filterDropdown({
      setSelectedKeys,
      selectedKeys: ["1,2"],
      confirm,
      clearFilters,
    });
    const [numberRangeEl] = collectElements(numberRangeDropdown, (el) => el.type === mockNumberRange);
    expect(numberRangeEl.props.value).toEqual(["1", "2"]);
    numberRangeEl.props.onChange(["3", "4"]);
    expect(setSelectedKeys).toHaveBeenCalledWith(["3", "4"]);

    const dateRangeProps = getColumnSearchProps(
      "date",
      {
        filterDropdownConfig: {
          type: FieldType.DATE_RANGE_PICKER,
        },
      },
      null
    );
    const dateRangeDropdown = dateRangeProps.filterDropdown({
      setSelectedKeys,
      selectedKeys: ["2026-01-01,2026-01-31"],
      confirm,
      clearFilters,
    });
    const [dateRangeEl] = collectElements(dateRangeDropdown, (el) => el.type === mockRangeStrPicker);
    expect(dateRangeEl.props.value).toEqual(["2026-01-01", "2026-01-31"]);
    dateRangeEl.props.onChange(["2026-02-01", "2026-02-28"]);
    expect(setSelectedKeys).toHaveBeenCalledWith(["2026-02-01", "2026-02-28"]);
  });

  test("handles select single and multiple branches", () => {
    const setSelectedKeys = jest.fn();
    const confirm = jest.fn();
    const clearFilters = jest.fn();

    const singleProps = getColumnSearchProps(
      "status",
      {
        filterDropdownConfig: {
          type: FieldType.SELECT,
          dropdownProps: {},
        },
      },
      null
    );
    const singleDropdown = singleProps.filterDropdown({
      setSelectedKeys,
      selectedKeys: [],
      confirm,
      clearFilters,
    });
    const [singleSelect] = collectElements(singleDropdown, (el) => el.type === mockRestSelect);
    singleSelect.props.onChange("done");
    expect(setSelectedKeys).toHaveBeenCalledWith(["done"]);
    expect(confirm).toHaveBeenCalled();

    const multipleProps = getColumnSearchProps(
      "status_multi",
      {
        filterDropdownConfig: {
          type: FieldType.SELECT,
          dropdownProps: { mode: "multiple" },
        },
      },
      null
    );
    const multipleDropdown = multipleProps.filterDropdown({
      setSelectedKeys,
      selectedKeys: ["a,b"],
      confirm,
      clearFilters,
    });
    const [multipleSelect] = collectElements(multipleDropdown, (el) => el.type === mockRestSelect);
    expect(multipleSelect.props.value).toEqual(["a", "b"]);
    multipleSelect.props.onChange(["x", "y"]);
    expect(setSelectedKeys).toHaveBeenCalledWith(["x", "y"]);
  });

  test("handles non-vertical layout action button", () => {
    const setSelectedKeys = jest.fn();
    const confirm = jest.fn();
    const clearFilters = jest.fn();

    const props = getColumnSearchProps(
      "name_h",
      {
        filterDropdownConfig: {
          type: FieldType.INPUT,
          antdSpaceProps: { direction: "horizontal" },
        },
      },
      null
    );

    const dropdown = props.filterDropdown({
      setSelectedKeys,
      selectedKeys: [],
      confirm,
      clearFilters,
    });
    const buttons = collectElements(dropdown, (el) => el.type === mockButton);
    expect(buttons).toHaveLength(1);
    buttons[0].props.onClick();
    expect(confirm).toHaveBeenCalled();
  });

  test("focuses input when dropdown opens for input type", () => {
    jest.useFakeTimers();
    const selectSpy = jest.fn();
    const props = getColumnSearchProps(
      "focus_name",
      {
        filterDropdownConfig: {
          type: FieldType.INPUT,
        },
      },
      { select: selectSpy }
    );

    props.filterDropdownProps.onOpenChange(true);
    jest.advanceTimersByTime(120);
    expect(selectSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
