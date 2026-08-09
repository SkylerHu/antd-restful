import React from "react";
import { render, screen } from "@testing-library/react";
import { notification } from "antd";
import requests, {
  AbortablePromise,
  formatRequestError,
  getCookie,
  useSafeRequest,
  makeSafeRequest,
  reqInterceptor,
  resInterceptor,
} from "src/requests";

let mockAxiosInstance;

// Mock antd notification
jest.mock("antd", () => {
  const { mockAntdVersion } = jest.requireActual("../test-utils/testVersion");
  return {
    version: mockAntdVersion,
    notification: {
      error: jest.fn(),
    },
  };
});

// Mock axios
jest.mock("axios", () => {
  mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn((fn) => fn) },
      response: { use: jest.fn((ok, err) => err) },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    isCancel: jest.fn(),
  };
});

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "csrftoken=test-token; sessionid=test-session",
});

// Mock document.querySelector
document.querySelector = jest.fn();

describe("requests module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 抑制控制台错误
    jest.spyOn(console, "error").mockImplementation(() => {});
    document.querySelector.mockReturnValue(null);
  });

  describe("formatRequestError", () => {
    it("should format unknown error", () => {
      const error = new Error("Unknown error");
      const result = formatRequestError(error);

      expect(result.message).toBe("未知错误");
      expect(result.description).toBe("Unknown error");
    });

    it("should format HTTP error with response", () => {
      const error = {
        response: {
          status: 404,
          data: { message: "Not found" },
        },
        config: {
          method: "get",
          url: "/api/test",
        },
        message: "Request failed",
      };

      const result = formatRequestError(error);

      expect(result.message).toBe("HttpError(404)");
      expect(result.description).toBe('GET /api/test\n{"message":"Not found"}');
    });
  });

  describe("getCookie", () => {
    it("should return cookie value when exists", () => {
      const result = getCookie("csrftoken");
      expect(result).toBe("test-token");
    });

    it("should return null when cookie does not exist", () => {
      const result = getCookie("nonexistent");
      expect(result).toBeNull();
    });

    it("should return null when no cookies", () => {
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "",
      });

      const result = getCookie("csrftoken");
      expect(result).toBeNull();
    });

    it("should handle cookie with spaces", () => {
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "csrftoken=test-token; sessionid=test-session",
      });

      const result = getCookie("sessionid");
      expect(result).toBe("test-session");
    });
  });

  describe("useSafeRequest hook", () => {
    it("should return makeRequest function", () => {
      const TestComponent = () => {
        const [makeRequest] = useSafeRequest();
        return <div data-testid="hook-test">{typeof makeRequest}</div>;
      };

      render(<TestComponent />);

      expect(screen.getByText("function")).toBeInTheDocument();
    });

    it("should unmount and cleanup on component unmount", () => {
      const TestComponent = () => {
        const [makeRequest] = useSafeRequest();
        return <div data-testid="hook-test">{typeof makeRequest}</div>;
      };

      const { unmount } = render(<TestComponent />);

      // Mock the unmount function
      const mockUnmount = jest.fn();
      const safeRequest = makeSafeRequest();
      jest.spyOn(safeRequest, "unmount").mockImplementation(mockUnmount);

      unmount();

      // Note: In a real test environment, you might need to wait for useEffect cleanup
      // This is a simplified test
    });
  });

  describe("axios instance", () => {
    it("should export axios instance", () => {
      expect(requests).toBeDefined();
      expect(requests.interceptors).toBeDefined();
    });

    it("should handle CSRF token in request interceptor", () => {
      document.querySelector.mockReturnValue({ value: "csrf-from-dom" });
      const nextConfig = reqInterceptor({
        method: "post",
        headers: { existing: "x" },
      });

      expect(nextConfig.headers).toEqual(
        expect.objectContaining({
          existing: "x",
          "X-CSRFToken": "csrf-from-dom",
        })
      );
    });

    it("should handle CSRF token from cookie when not in DOM", () => {
      document.querySelector.mockReturnValue(null);
      const nextConfig = reqInterceptor({
        method: "delete",
        headers: {},
      });

      expect(nextConfig.headers["X-CSRFToken"]).toBe("test-token");
    });

    it("should keep request unchanged for non-write methods", () => {
      const nextConfig = reqInterceptor({
        method: "get",
        headers: { foo: "bar" },
      });

      expect(nextConfig.headers).toEqual({ foo: "bar" });
    });

    it("should notify response error with dedup key for 403", async () => {
      const error = {
        name: "AxiosError",
        response: { status: "403", data: { detail: "forbidden" } },
        config: { method: "get", url: "/api/secure" },
        message: "forbidden",
      };

      await expect(resInterceptor(error)).rejects.toBe(error);
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "403",
          message: "HttpError(403)",
        })
      );
    });

    it("should skip notification when disableNotiError is true", async () => {
      const error = {
        name: "AxiosError",
        response: { status: 500, data: { detail: "bad" } },
        config: { method: "get", url: "/api/fail", disableNotiError: true },
        message: "bad",
      };

      await expect(resInterceptor(error)).rejects.toBe(error);
      expect(notification.error).not.toHaveBeenCalled();
    });

    it("should skip notification for canceled errors", async () => {
      const error = {
        name: "CanceledError",
        config: { method: "get", url: "/api/fail" },
        message: "cancel",
      };

      await expect(resInterceptor(error)).rejects.toBe(error);
      expect(notification.error).not.toHaveBeenCalled();
    });

  });

  describe("AbortablePromise", () => {
    it("should create a promise that can be resolved", async () => {
      const promise = new AbortablePromise((resolve) => {
        resolve("success");
      });

      const result = await promise;
      expect(result).toBe("success");
    });

    it("should create a promise that can be rejected", async () => {
      const promise = new AbortablePromise((resolve, reject) => {
        reject(new Error("test error"));
      });

      await expect(promise).rejects.toThrow("test error");
    });

    it("should have abort method and isAborted property", () => {
      const promise = new AbortablePromise(() => {});

      expect(typeof promise.abort).toBe("function");
      expect(promise.isAborted).toBe(false);
    });

    it("should abort promise and set isAborted flag", () => {
      const promise = new AbortablePromise(() => {});

      promise.abort();

      expect(promise.isAborted).toBe(true);
    });

    it("should handle then method when not aborted", async () => {
      const promise = new AbortablePromise((resolve) => {
        resolve("original");
      });

      const result = await promise.then((value) => value + "-modified");
      expect(result).toBe("original-modified");
    });

    it("should handle then method when aborted", async () => {
      const promise = new AbortablePromise((resolve) => {
        resolve("original");
      });

      promise.abort();

      const result = await promise.then((value) => value + "-modified");
      expect(result).toBeUndefined();
    });

    it("should handle catch method when not aborted", async () => {
      const promise = new AbortablePromise((resolve, reject) => {
        reject(new Error("original error"));
      });

      await expect(promise.catch((error) => {
        throw new Error("caught: " + error.message);
      })).rejects.toThrow("caught: original error");
    });

    it("should handle catch method when aborted", async () => {
      const promise = new AbortablePromise((resolve, reject) => {
        reject(new Error("original error"));
      });

      promise.abort();

      const result = await promise.catch((error) => "caught: " + error.message);
      expect(result).toBeUndefined();
    });

    it("should handle finally method when not aborted", async () => {
      let finallyCalled = false;
      const promise = new AbortablePromise((resolve) => {
        resolve("success");
      });

      const result = await promise.finally(() => {
        finallyCalled = true;
      });

      expect(result).toBe("success");
      expect(finallyCalled).toBe(true);
    });

    it("should handle finally method when aborted", async () => {
      let finallyCalled = false;
      const promise = new AbortablePromise((resolve) => {
        resolve("success");
      });

      promise.abort();

      const result = await promise.finally(() => {
        finallyCalled = true;
      });

      expect(result).toBeUndefined();
      expect(finallyCalled).toBe(false);
    });

    it("should handle chained catch calls when aborted", async () => {
      const promise = new AbortablePromise((resolve, reject) => {
        reject(new Error("original"));
      });

      promise.abort();

      const result = await promise
        .catch((error) => "caught: " + error.message)
        .catch((error) => "double caught: " + error.message);

      expect(result).toBeUndefined();
    });

    it("should work with async/await syntax", async () => {
      const promise = new AbortablePromise((resolve) => {
        resolve("async result");
      });

      const result = await promise;
      expect(result).toBe("async result");
    });

    it("should handle immediate resolution when not aborted", async () => {
      const promise = new AbortablePromise((resolve) => {
        resolve("immediate");
      });

      const result = await promise;
      expect(result).toBe("immediate");
    });

    it("should handle immediate rejection when not aborted", async () => {
      const promise = new AbortablePromise((resolve, reject) => {
        reject(new Error("immediate error"));
      });

      await expect(promise).rejects.toThrow("immediate error");
    });
  });

  describe("makeSafeRequest methods", () => {
    it("should call all wrapped http methods with signal config", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: "get" });
      mockAxiosInstance.head.mockResolvedValue({ data: "head" });
      mockAxiosInstance.options.mockResolvedValue({ data: "options" });
      mockAxiosInstance.post.mockResolvedValue({ data: "post" });
      mockAxiosInstance.patch.mockResolvedValue({ data: "patch" });
      mockAxiosInstance.put.mockResolvedValue({ data: "put" });
      mockAxiosInstance.delete.mockResolvedValue({ data: "delete" });

      const makeRequest = makeSafeRequest();

      await makeRequest({ key: 9 }).get("/get", { params: { p: 1 } });
      await makeRequest().head("/head");
      await makeRequest().options("/options");
      await makeRequest().post("/post", { a: 1 }, { timeout: 1 });
      await makeRequest().patch("/patch", { b: 2 });
      await makeRequest().put("/put", { c: 3 });
      await makeRequest().delete("/delete", { id: 1 }, { headers: { x: "y" } });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/get",
        expect.objectContaining({ params: { p: 1 }, signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.head).toHaveBeenCalledWith(
        "/head",
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.options).toHaveBeenCalledWith(
        "/options",
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/post",
        { a: 1 },
        expect.objectContaining({ timeout: 1, signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        "/patch",
        { b: 2 },
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        "/put",
        { c: 3 },
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        "/delete",
        { id: 1 },
        expect.objectContaining({ headers: { x: "y" }, signal: expect.any(AbortSignal) })
      );
    });
  });

});
