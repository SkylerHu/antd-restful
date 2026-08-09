/* eslint-disable react/prop-types, react/display-name */
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UploadView from "src/components/formitems/UploadView";

let mockUploadProps;
let mockDraggerProps;
const mockMessageError = jest.fn();
const mockMessageSuccess = jest.fn();
const mockPostRequest = jest.fn(() =>
  Promise.resolve({ data: { url: "http://example.com/file.png", thumbUrl: "http://example.com/file-thumb.png" } })
);
const mockMakeRequest = jest.fn(() => ({ post: mockPostRequest }));

jest.mock("@ant-design/icons", () => ({
  InboxOutlined: () => <span data-testid="icon-inbox" />,
  PaperClipOutlined: () => <span data-testid="icon-paperclip" />,
  UploadOutlined: () => <span data-testid="icon-upload" />,
}));

jest.mock("src/requests", () => ({
  useSafeRequest: () => [mockMakeRequest],
}));

jest.mock("antd", () => {
  const UploadMock = (props) => {
    mockUploadProps = props;
    return <div data-testid="upload">{props.children}</div>;
  };
  UploadMock.Dragger = (props) => {
    mockDraggerProps = props;
    return <div data-testid="upload-dragger">{props.children}</div>;
  };
  const SpaceMock = ({ children, ...props }) => <div {...props}>{children}</div>;
  SpaceMock.Compact = ({ children, ...props }) => <div {...props}>{children}</div>;
  return {
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    Image: ({ src, alt }) => <img alt={alt} src={src} data-testid="readonly-image" />,
    message: {
      error: (...args) => mockMessageError(...args),
      success: (...args) => mockMessageSuccess(...args),
    },
    Space: SpaceMock,
    Tooltip: ({ children }) => <div>{children}</div>,
    Upload: UploadMock,
  };
});

describe("UploadView branches", () => {
  const MOCK_FILE = {
    uid: "1",
    name: "test.png",
    size: 1024,
    type: "image/png",
    status: "done",
    url: "http://example.com/test.png",
    thumbUrl: "http://example.com/thumb.png",
  };

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockUploadProps = undefined;
    mockDraggerProps = undefined;
    mockMessageError.mockClear();
    mockMessageSuccess.mockClear();
    mockPostRequest.mockClear();
    mockMakeRequest.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("blocks upload by maxSize and maxCount guards", async () => {
    render(
      <UploadView
        uploadUrl="/api/upload/"
        maxSize={10}
        maxCount={2}
        value={[
          { uid: "1", name: "a.png", url: "http://a", status: "done" },
          { uid: "2", name: "b.png", url: "http://b", status: "done" },
        ]}
      />
    );
    await waitFor(() => {
      expect(mockUploadProps.fileList).toHaveLength(2);
    });
    expect(mockUploadProps.beforeUpload({ size: 11 })).toBe(false);
    expect(mockUploadProps.beforeUpload({ size: 1 })).toBe(false);
    expect(mockMessageError).toHaveBeenCalled();
  });

  test("returns disabled error in customRequest", () => {
    render(<UploadView uploadUrl="/api/upload/" disabled />);
    const onError = jest.fn();
    mockUploadProps.customRequest({
      file: { uid: "d1", name: "disabled.png", size: 10, type: "image/png" },
      onProgress: jest.fn(),
      onSuccess: jest.fn(),
      onError,
    });
    expect(onError).toHaveBeenCalled();
    expect(mockPostRequest).not.toHaveBeenCalled();
  });

  test("handles customRequest success/error and progress", async () => {
    const appendSpy = jest.spyOn(FormData.prototype, "append");
    const onProgress = jest.fn();
    render(<UploadView uploadUrl="/api/upload/" baseParams={{ biz: "test" }} maxCount={2} />);

    mockPostRequest.mockImplementationOnce((url, formData, config) => {
      config.onUploadProgress({ loaded: 5, total: 10 });
      return Promise.resolve({ data: { url: "http://u", thumbUrl: "http://t" } });
    });
    await act(async () => {
      mockUploadProps.customRequest({
        file: { uid: "up-1", name: "ok.png", size: 10, type: "image/png" },
        onProgress,
        onSuccess: jest.fn(),
        onError: jest.fn(),
      });
    });

    await waitFor(() => {
      expect(onProgress).toHaveBeenCalledWith({ percent: 50 });
      expect(appendSpy).toHaveBeenCalledWith("biz", "test");
      expect(mockMessageSuccess).toHaveBeenCalled();
    });

    mockPostRequest.mockRejectedValueOnce(new Error("network error"));
    const onError = jest.fn();
    await act(async () => {
      mockUploadProps.customRequest({
        file: { uid: "up-2", name: "fail.png", size: 10, type: "image/png" },
        onProgress: jest.fn(),
        onSuccess: jest.fn(),
        onError,
      });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(mockMessageError).toHaveBeenCalledWith("文件 fail.png 上传失败");
    });
  });

  test("maps onChange to single/array and preserveResponse", () => {
    const onChange = jest.fn();
    const { rerender } = render(<UploadView uploadUrl="/api/upload/" preserveResponse onChange={onChange} />);

    mockUploadProps.onChange({
      fileList: [
        {
          ...MOCK_FILE,
          response: { url: "http://a", thumbUrl: "http://a-thumb", bizId: 123 },
        },
      ],
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ response: expect.objectContaining({ bizId: 123 }) })
    );

    const onChangeArr = jest.fn();
    rerender(<UploadView uploadUrl="/api/upload/" maxCount={2} onChange={onChangeArr} />);
    mockUploadProps.onChange({ fileList: [MOCK_FILE] });
    expect(onChangeArr).toHaveBeenCalledWith([expect.objectContaining({ name: "test.png" })]);
  });

  test("handles onRemove and dragger/readOnly non-picture branches", async () => {
    const { rerender } = render(
      <UploadView
        uploadUrl="/api/upload/"
        maxCount={2}
        value={[
          { uid: "1", name: "a.png", url: "http://a", status: "uploading" },
          { uid: "2", name: "b.png", url: "http://b", status: "done" },
        ]}
      />
    );
    await waitFor(() => {
      expect(mockUploadProps.fileList).toHaveLength(2);
    });
    await act(async () => {
      mockUploadProps.onRemove({ uid: "1" });
    });
    await waitFor(() => {
      expect(mockUploadProps.fileList).toHaveLength(1);
    });

    rerender(<UploadView uploadUrl="/api/upload/" enableDragger />);
    expect(screen.getByTestId("upload-dragger")).toBeInTheDocument();
    expect(mockDraggerProps).toBeDefined();

    rerender(
      <UploadView
        uploadUrl="/api/upload/"
        readOnly
        listType="text"
        value={[{ uid: "3", name: "x.txt", url: "http://x", status: "done" }]}
      />
    );
    expect(screen.getByRole("button", { name: "x.txt" })).toBeInTheDocument();
  });
});
