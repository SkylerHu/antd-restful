/* eslint-disable react/prop-types, react/display-name */
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { READ_ONLY_CLASS } from "src/common/constants";
import RestTreeSelect from "src/components/formitems/RestTreeSelect";

let mockTreeSelectProps;
const mockGet = jest.fn();
const mockMakeRequest = jest.fn(() => ({ get: mockGet }));

jest.mock("src/requests", () => ({
  useSafeRequest: () => [mockMakeRequest],
}));

jest.mock("src/components/CopyView", () => (props) => (
  <span data-testid="copy-view">{props.children || String(props.value)}</span>
));

jest.mock("antd", () => {
  const SpaceMock = ({ children }) => <div>{children}</div>;
  SpaceMock.Compact = ({ children }) => <div data-testid="space-compact">{children}</div>;
  return {
    Space: SpaceMock,
    Spin: () => <span data-testid="loading">loading</span>,
    Tag: ({ children }) => <span data-testid="tag">{children}</span>,
    Tooltip: ({ children }) => <span>{children}</span>,
    TreeSelect: (props) => {
      mockTreeSelectProps = props;
      return <div data-testid="tree-select" />;
    },
  };
});

describe("RestTreeSelect branches", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockTreeSelectProps = undefined;
    mockGet.mockClear();
    mockMakeRequest.mockClear();
    mockGet.mockImplementation((url, { params }) => {
      if (params?.parent__isnull) {
        return Promise.resolve({
          data: {
            results: [{ value: "root-1", label: "Root 1", isLeaf: false }],
          },
        });
      }
      return Promise.resolve({
        data: {
          results: [{ value: `${params.parent}-child`, label: "Child Node", isLeaf: true }],
        },
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("loads root nodes and maps selected nodes in onChange callback", async () => {
    const handleChange = jest.fn();
    render(<RestTreeSelect restful="/api/tree" onChange={handleChange} />);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith(
        "/api/tree",
        expect.objectContaining({ params: { "parent__isnull": true } })
      );
      expect(mockTreeSelectProps.treeData).toHaveLength(1);
    });

    await act(async () => {
      mockTreeSelectProps.onChange("root-1");
    });
    expect(handleChange).toHaveBeenCalledWith(
      "root-1",
      [expect.objectContaining({ value: "root-1", label: "Root 1" })]
    );
  });

  test("supports filterTreeNode by key and label", async () => {
    render(<RestTreeSelect restful="/api/tree" />);
    await waitFor(() => {
      expect(mockTreeSelectProps).toBeDefined();
    });
    expect(mockTreeSelectProps.filterTreeNode("root", { value: "root-1", label: "Root 1" })).toBe(true);
    expect(mockTreeSelectProps.filterTreeNode("Root", { value: "root-1", label: "Root 1" })).toBe(true);
    expect(mockTreeSelectProps.filterTreeNode("none", { value: "root-1", label: "Root 1" })).toBe(false);
    expect(mockTreeSelectProps.filterTreeNode("", { value: "root-1", label: "Root 1" })).toBe(true);
  });

  test("loads children through loadData branch", async () => {
    render(<RestTreeSelect restful="/api/tree" />);
    await waitFor(() => {
      expect(mockTreeSelectProps.treeData).toHaveLength(1);
    });

    await act(async () => {
      await mockTreeSelectProps.loadData({ value: "root-1" });
    });
    await waitFor(() => {
      expect(mockTreeSelectProps.treeData[0].children).toEqual([
        expect.objectContaining({ value: "root-1-child" }),
      ]);
    });
  });

  test("renders readonly tags/copy wrapper and single readonly value", () => {
    const { rerender } = render(
      <RestTreeSelect
        readOnly
        enableCopy
        value={["root-1"]}
        treeData={[{ value: "root-1", label: "Root 1", children: [] }]}
      />
    );
    expect(screen.getByText("Root 1")).toBeInTheDocument();
    expect(screen.getByTestId("copy-view")).toBeInTheDocument();
    const readonlyContainer = screen.getByText("Root 1").closest(`.${READ_ONLY_CLASS}`);
    expect(readonlyContainer).toBeInTheDocument();

    rerender(
      <RestTreeSelect
        readOnly
        value="root-1"
        treeData={[{ value: "root-1", label: "Root 1", children: [] }]}
      />
    );
    expect(screen.getByText("Root 1")).toBeInTheDocument();
    expect(screen.queryByTestId("tag")).not.toBeInTheDocument();
  });

  test("does not request when disabled/readOnly", async () => {
    const { rerender } = render(<RestTreeSelect restful="/api/tree" disabled />);
    await waitFor(() => {
      expect(mockGet).not.toHaveBeenCalled();
    });
    rerender(<RestTreeSelect restful="/api/tree" readOnly />);
    await waitFor(() => {
      expect(mockGet).not.toHaveBeenCalled();
    });
  });
});
