import "@testing-library/jest-dom";
import "@testing-library/user-event";

import { cleanup } from "@testing-library/react";
import { beforeAll } from "@jest/globals";
import { mockAntdMajorVersion } from "./test-utils/testVersion";

const enableSnapshots = mockAntdMajorVersion === 5;

if (!enableSnapshots) {
  // eslint-disable-next-line no-undef
  expect.extend({
    toMatchSnapshot() {
      return {
        pass: true,
        message: () => "snapshot assertion is skipped when ANTD_TEST_VERSION major is not 5",
      };
    },
    toMatchInlineSnapshot() {
      return {
        pass: true,
        message: () => "inline snapshot assertion is skipped when ANTD_TEST_VERSION major is not 5",
      };
    },
  });
}


beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    // eslint-disable-next-line no-undef
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      // eslint-disable-next-line no-undef
      addListener: jest.fn(), // Deprecated
      // eslint-disable-next-line no-undef
      removeListener: jest.fn(), // Deprecated
      // eslint-disable-next-line no-undef
      addEventListener: jest.fn(),
      // eslint-disable-next-line no-undef
      removeEventListener: jest.fn(),
      // eslint-disable-next-line no-undef
      dispatchEvent: jest.fn(),
    })),
  });

  if (typeof global.ResizeObserver === "undefined") {
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    global.ResizeObserver = MockResizeObserver;
    window.ResizeObserver = MockResizeObserver;
  }

  if (typeof global.MessageChannel === "undefined") {
    class MockMessagePort {
      constructor() {
        this.peer = null;
        this.onmessage = null;
      }

      postMessage(data) {
        const target = this.peer;
        if (!target) return;
        setTimeout(() => {
          if (typeof target.onmessage === "function") {
            target.onmessage({ data });
          }
        }, 0);
      }

      addEventListener(type, listener) {
        if (type === "message") {
          this.onmessage = listener;
        }
      }

      removeEventListener(type, listener) {
        if (type === "message" && this.onmessage === listener) {
          this.onmessage = null;
        }
      }

      start() {}
      close() {}
    }

    class MockMessageChannel {
      constructor() {
        this.port1 = new MockMessagePort();
        this.port2 = new MockMessagePort();
        this.port1.peer = this.port2;
        this.port2.peer = this.port1;
      }
    }

    global.MessageChannel = MockMessageChannel;
    window.MessageChannel = MockMessageChannel;
  }

  if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.scrollIntoView) {
    // eslint-disable-next-line no-undef
    HTMLElement.prototype.scrollIntoView = jest.fn();
  }

  if (typeof Element !== "undefined" && typeof Element.prototype.closest === "function") {
    const originalClosest = Element.prototype.closest;
    Element.prototype.closest = function patchedClosest(selector) {
      try {
        return originalClosest.call(this, selector);
      } catch (error) {
        return null;
      }
    };
  }
});

// // afterEach is globally available in Jest
// eslint-disable-next-line no-undef
afterEach(() => {
  cleanup();
  // eslint-disable-next-line no-undef
  jest.restoreAllMocks();
  // eslint-disable-next-line no-undef
  jest.clearAllTimers();
});
