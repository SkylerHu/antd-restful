import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RestSelect from "src/components/formitems/RestSelect";
import CompareEdit from "src/components/formitems/CompareEdit";

const MOCK_OPTIONS = [
  { value: 1, label: "Option 1", "data-testid": "option-1" },
  { value: 2, label: "Option 2", "data-testid": "option-2" },
];

const TriggerChild = ({ onChange }) => ( // eslint-disable-line react/prop-types
  <button type="button" onClick={() => onChange("new", "extra")}>
    trigger-change
  </button>
);
describe("CompareEdit", () => {
  it("should render in readOnly mode", () => {
    const { container } = render(
      <CompareEdit historyValue={1} fieldValue="value" readOnly>
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );
    expect(container).toMatchSnapshot();
  });
  it("should render with history value", () => {
    const { container } = render(
      <CompareEdit historyValue={1} fieldValue="value">
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render when value changes", async () => {
    const { container } = render(
      <CompareEdit historyValue={1} fieldValue="value">
        <RestSelect options={MOCK_OPTIONS} value={2} />
      </CompareEdit>
    );
    expect(container).toMatchSnapshot();
  });

  it("should call parent onChange when child emits changes", () => {
    const onChange = jest.fn();
    render(
      <CompareEdit historyValue="old" value="old" onChange={onChange}>
        <TriggerChild />
      </CompareEdit>
    );

    fireEvent.click(screen.getByRole("button", { name: "trigger-change" }));
    expect(onChange).toHaveBeenCalledWith("new", "extra");
  });

  it("should show type mismatch message when old/new value types differ", async () => {
    render(
      <CompareEdit historyValue={{ id: 1 }} value={[1, 2]} readOnly>
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );

    await waitFor(() => {
      expect(screen.getByText("修改前后数据类型不一致")).toBeInTheDocument();
    });
  });

  it("should display emptyLabel and new value in readOnly mode", async () => {
    render(
      <CompareEdit historyValue="" value="new-value" readOnly emptyLabel="EMPTY_LABEL">
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );

    await waitFor(() => {
      expect(screen.getByText("EMPTY_LABEL")).toBeInTheDocument();
      expect(screen.getByText("new-value")).toBeInTheDocument();
    });
  });

  it("should not render new value tags in editable mode", async () => {
    render(
      <CompareEdit historyValue="old-value" value="new-value">
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );

    await waitFor(() => {
      expect(screen.getByText("old-value")).toBeInTheDocument();
    });
    expect(screen.queryByText("new-value", { selector: ".ant-tag" })).not.toBeInTheDocument();
  });

  it("should render removed, unchanged and added tags for array values in readOnly mode", async () => {
    render(
      <CompareEdit historyValue={["a", "b"]} value={["b", "c"]} readOnly>
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );

    await waitFor(() => {
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("b")).toBeInTheDocument();
      expect(screen.getByText("c")).toBeInTheDocument();
    });
  });

  it("should compare object values when both history and current are dict", async () => {
    render(
      <CompareEdit
        historyValue={{ id: 1, name: "Old Name" }}
        value={{ id: 2, name: "New Name" }}
        readOnly
        fieldValue="id"
        labelTemplate="{name}"
      >
        <RestSelect options={MOCK_OPTIONS} />
      </CompareEdit>
    );

    await waitFor(() => {
      expect(screen.getByText("Old Name")).toBeInTheDocument();
      expect(screen.getByText("New Name")).toBeInTheDocument();
    });
  });
});


