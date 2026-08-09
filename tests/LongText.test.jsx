import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LongText from "src/components/LongText";

describe("LongText", () => {
  it("should render basic value", () => {
    const { container } = render(<LongText value={1} />);
    expect(container).toMatchSnapshot();
  });

  it("should render string value with maxLength", () => {
    const { container } = render(<LongText value="我是中国人，我爱中国!" maxLength={2} />);
    expect(container).toMatchSnapshot();
  });

  it("should render array value with maxLength", () => {
    const { container } = render(<LongText value={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} separator=", " maxLength={2} />);
    expect(container).toMatchSnapshot();
  });

  it("should render object value with labelTemplate", () => {
    const { container } = render(
      <LongText value={{ id: 1, username: "admin", nickname: "管理员" }} labelTemplate="{nickname}({username})" />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render array of objects with labelTemplate and maxLength", () => {
    const { container } = render(
      <LongText
        value={[
          { id: 1, username: "admin", nickname: "管理员" },
          { id: 2, username: "skyler", nickname: "Skyler" },
        ]}
        labelTemplate="{nickname}({username})"
        maxLength={1}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should show modal when clicking view button", async () => {
    const { getByRole } = render(
      <LongText value={{ id: 1, username: "admin", nickname: "管理员" }} labelTemplate="{nickname}({username})" />
    );

    const button = getByRole("button");
    // 点击前modal不应该显示
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(button);
    await waitFor(() => {
      // 点击后modal应该显示
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });
  });

  it("should toggle origin view icon for object with labelTemplate", async () => {
    render(
      <LongText
        value={{ id: 1, username: "admin", nickname: "管理员" }}
        labelTemplate="{nickname}({username})"
      />
    );

    const openButton = screen.getByRole("button");
    await userEvent.click(openButton);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const toggleButton = screen.getAllByRole("button")[1];
    await userEvent.click(toggleButton);
    expect(screen.getByText(/"username": "admin"/)).toBeInTheDocument();
  });

  it("should close modal when cancel is clicked", async () => {
    render(<LongText value="long text for modal" maxLength={2} />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("Close"));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
