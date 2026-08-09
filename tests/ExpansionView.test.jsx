import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpansionView from "src/components/formitems/ExpansionView";
import requests from "src/requests";

describe("ExpansionView", () => {
  it("should render initial state", () => {
    const { container } = render(<ExpansionView restful="api/users/" />);
    expect(container).toMatchSnapshot();
  });
  it("should render in readOnly mode", () => {
    const { container } = render(<ExpansionView value={{ input: "user" }} restful="api/users/" readOnly />);
    expect(container).toMatchSnapshot();
  });
  it("should render with enableBraceExpansion", () => {
    const { container } = render(<ExpansionView enableBraceExpansion />);
    const input = container.querySelector("input");
    fireEvent.change(input, { target: { value: "{{1,{2..4}}}" } });
    expect(container).toMatchSnapshot();
  });

  it("should render success state after successful request", async () => {
    const fetch = jest.spyOn(requests, "post").mockResolvedValue({
      data: { output: "验证通过", error: null },
    });

    const inputKey = "test";
    const { container, queryByRole } = render(<ExpansionView restful="api/users/" inputKey={inputKey} />);

    const input = container.querySelector("input");
    await userEvent.type(input, "a");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("api/users/", { [inputKey]: "a" }, expect.anything());
    });

    expect(queryByRole("alert")).toBeInTheDocument();
    expect(container.querySelector(".ant-alert-success")).toBeInTheDocument();
  });

  it("should render error state after failed request", async () => {
    jest.spyOn(requests, "post").mockRejectedValue({
      data: { valid: false, message: "验证失败" },
    });

    const { container, queryByRole } = render(<ExpansionView restful="api/users/" />);

    const input = container.querySelector("input");
    await userEvent.type(input, "a");

    await waitFor(() => {
      expect(queryByRole("alert")).toBeInTheDocument();
      expect(container.querySelector(".ant-alert-error")).toBeInTheDocument();
    });
  });

  it("should not request when input length is less than inputMinEnter", async () => {
    const fetch = jest.spyOn(requests, "post").mockResolvedValue({ data: { output: "ok", error: null } });

    const { container } = render(<ExpansionView restful="api/users/" inputMinEnter={2} />);
    const input = container.querySelector("input");
    await userEvent.type(input, "a");

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it("should generate local output with brace expansion and valueTemplate", async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <ExpansionView
        enableBraceExpansion
        valueTemplate="{prefix}-{value}"
        baseParams={{ prefix: "P" }}
        onChange={handleChange}
      />
    );
    const input = container.querySelector("input");
    fireEvent.change(input, { target: { value: "{1..2}" } });

    await waitFor(() => {
      const latest = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(latest.output).toEqual(["P-1", "P-2"]);
      expect(latest.error).toBeNull();
    });
  });
});
