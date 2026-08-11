import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Checkbox, Input, Radio, Switch } from "antd";
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

  it("should forward onChange to child's original onChange handler", () => {
    const parentOnChange = jest.fn();
    const childOnChange = jest.fn();
    render(
      <CompareEdit historyValue="old" value="old" onChange={parentOnChange}>
        <TriggerChild onChange={childOnChange} />
      </CompareEdit>
    );

    fireEvent.click(screen.getByRole("button", { name: "trigger-change" }));
    expect(parentOnChange).toHaveBeenCalledWith("new", "extra");
    expect(childOnChange).toHaveBeenCalledWith("new", "extra");
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

  describe("onChange value extraction (getValueFromEvent)", () => {
    it("should extract e.target.value from Input onChange", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue="old" value="old" onChange={onChange}>
          <Input data-testid="input" />
        </CompareEdit>
      );

      const input = screen.getByTestId("input");
      fireEvent.change(input, { target: { value: "new-text" } });
      expect(onChange).toHaveBeenCalledWith("new-text");
    });

    it("should extract checked from Switch onChange (direct value)", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue={false} value={false} onChange={onChange}>
          <Switch data-testid="switch" />
        </CompareEdit>
      );

      fireEvent.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0]).toBe(true);
    });

    it("should extract e.target.checked from single Checkbox onChange", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue={false} value={false} onChange={onChange} valuePropName="checked">
          <Checkbox data-testid="checkbox">Check me</Checkbox>
        </CompareEdit>
      );

      fireEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("should auto-infer checked for Checkbox without explicit fieldValue", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue={false} value={false} onChange={onChange}>
          <Checkbox data-testid="checkbox">Auto infer</Checkbox>
        </CompareEdit>
      );

      fireEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("should pass value directly for Checkbox.Group onChange", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue={["a"]} value={["a"]} onChange={onChange}>
          <Checkbox.Group
            options={[
              { label: "A", value: "a" },
              { label: "B", value: "b" },
            ]}
          />
        </CompareEdit>
      );

      const checkboxB = screen.getByRole("checkbox", { name: "B" });
      fireEvent.click(checkboxB);
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining(["a", "b"])
      );
    });

    it("should use custom getValueFromEvent when provided", () => {
      const onChange = jest.fn();
      const customExtractor = (e) => `custom:${e.target.value}`;
      render(
        <CompareEdit
          historyValue="old"
          value="old"
          onChange={onChange}
          getValueFromEvent={customExtractor}
        >
          <Input data-testid="input" />
        </CompareEdit>
      );

      const input = screen.getByTestId("input");
      fireEvent.change(input, { target: { value: "hello" } });
      expect(onChange).toHaveBeenCalledWith("custom:hello");
    });

    it("should pass checked prop to Switch when valuePropName is checked", () => {
      const { container } = render(
        <CompareEdit historyValue={false} value={true} valuePropName="checked">
          <Switch />
        </CompareEdit>
      );

      const switchEl = container.querySelector(".ant-switch");
      expect(switchEl).toHaveClass("ant-switch-checked");
    });

    it("should extract e.target.value from Radio.Group onChange", () => {
      const onChange = jest.fn();
      render(
        <CompareEdit historyValue="a" value="a" onChange={onChange}>
          <Radio.Group>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
          </Radio.Group>
        </CompareEdit>
      );

      fireEvent.click(screen.getByRole("radio", { name: "B" }));
      expect(onChange).toHaveBeenCalledWith("b");
    });
  });
});


