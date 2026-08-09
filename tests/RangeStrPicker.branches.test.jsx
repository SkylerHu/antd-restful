/* eslint-disable react/prop-types, react/display-name */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { READ_ONLY_CLASS } from "src/common/constants";
import RangeStrPicker from "src/components/formitems/RangeStrPicker";

let mockDateRangePickerProps;

const mockDateRangePicker = jest.fn((props) => {
  mockDateRangePickerProps = props;
  return <div data-testid="date-range-picker" />;
});

const mockTimeRangePicker = jest.fn(() => <div data-testid="time-range-picker" />);
const mockCreateDate = jest.fn((value, format) => `parsed:${value}:${format || ""}`);

jest.mock("antd", () => {
  const { mockAntdVersion } = jest.requireActual("../test-utils/testVersion");
  return {
    version: mockAntdVersion,
    DatePicker: {
      RangePicker: (props) => mockDateRangePicker(props),
    },
    TimePicker: {
      RangePicker: (props) => mockTimeRangePicker(props),
    },
  };
});

jest.mock("src/common/dateUtils", () => ({
  createDate: (...args) => mockCreateDate(...args),
}));

describe("RangeStrPicker branches", () => {
  beforeEach(() => {
    mockDateRangePickerProps = undefined;
    mockDateRangePicker.mockClear();
    mockTimeRangePicker.mockClear();
    mockCreateDate.mockClear();
  });

  test("calls onChange(undefined, undefined) when date strings are empty", () => {
    const onChange = jest.fn();
    render(<RangeStrPicker onChange={onChange} />);
    mockDateRangePickerProps.onChange([], ["", ""]);
    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });

  test("maps empty side with defaultEmptyValue in onChange", () => {
    const onChange = jest.fn();
    render(<RangeStrPicker onChange={onChange} defaultEmptyValue="" />);
    const mockDates = [{}, {}];
    mockDateRangePickerProps.onChange(mockDates, ["2025-08-01", ""]);
    expect(onChange).toHaveBeenCalledWith(["2025-08-01", ""], mockDates);
  });

  test("uses TimePicker.RangePicker when isTime=true", () => {
    render(<RangeStrPicker isTime />);
    expect(screen.getByTestId("time-range-picker")).toBeInTheDocument();
    expect(mockTimeRangePicker).toHaveBeenCalledTimes(1);
    expect(mockDateRangePicker).not.toHaveBeenCalled();
  });

  test("converts value/defaultValue through createDate", () => {
    render(
      <RangeStrPicker
        value={["2025-01-01", null]}
        defaultValue={["2025-01-02", "2025-01-03"]}
        format="YYYY-MM-DD"
      />
    );

    expect(mockCreateDate).toHaveBeenNthCalledWith(1, "2025-01-01", "YYYY-MM-DD");
    expect(mockCreateDate).toHaveBeenNthCalledWith(2, "2025-01-02", "YYYY-MM-DD");
    expect(mockCreateDate).toHaveBeenNthCalledWith(3, "2025-01-03", "YYYY-MM-DD");
    expect(mockDateRangePickerProps.value).toEqual(["parsed:2025-01-01:YYYY-MM-DD", null]);
    expect(mockDateRangePickerProps.defaultValue).toEqual([
      "parsed:2025-01-02:YYYY-MM-DD",
      "parsed:2025-01-03:YYYY-MM-DD",
    ]);
  });

  test("renders readonly joined text and readonly class", () => {
    render(<RangeStrPicker readOnly value={["a", "b"]} className="custom" />);
    const text = screen.getByText("a ~ b");
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass("custom");
    expect(text).toHaveClass(READ_ONLY_CLASS);
  });
});
