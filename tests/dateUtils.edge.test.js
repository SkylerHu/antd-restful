describe("dateUtils edge branches", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.unmock("antd");
    jest.unmock("dayjs");
    jest.unmock("moment");
  });

  test("returns null when dayjs package is unavailable in antd5+", async () => {
    jest.doMock("antd", () => ({ version: "5.0.0" }));
    jest.doMock("dayjs", () => {
      throw new Error("dayjs missing");
    });

    const { createDate } = await import("src/common/dateUtils");
    expect(createDate("2023-01-01")).toBeNull();
  });

  test("returns null when moment package is unavailable in antd4", async () => {
    jest.doMock("antd", () => ({ version: "4.24.0" }));
    jest.doMock("moment", () => {
      throw new Error("moment missing");
    });

    const { createDate } = await import("src/common/dateUtils");
    expect(createDate("2023-01-01")).toBeNull();
  });

  test("returns null when dayjs parser throws", async () => {
    jest.doMock("antd", () => ({ version: "5.0.0" }));
    jest.doMock("dayjs", () => () => {
      throw new Error("parse error");
    });

    const { createDate } = await import("src/common/dateUtils");
    expect(createDate("2023-01-01")).toBeNull();
  });

  test("returns null when moment parser throws", async () => {
    jest.doMock("antd", () => ({ version: "4.24.0" }));
    jest.doMock("moment", () => () => {
      throw new Error("parse error");
    });

    const { createDate } = await import("src/common/dateUtils");
    expect(createDate("2023-01-01")).toBeNull();
  });

  test("uses antd4 isValidDate branch", async () => {
    jest.doMock("antd", () => ({ version: "4.24.0" }));
    jest.doMock("moment", () => () => ({
      isValid: () => true,
      format: () => "2023-01-01",
    }));

    const { isValidDate } = await import("src/common/dateUtils");
    expect(isValidDate("2023-01-01")).toBe(true);
  });

  test("returns empty string when format throws", async () => {
    jest.doMock("antd", () => ({ version: "5.0.0" }));
    jest.doMock("dayjs", () => () => ({
      isValid: () => true,
      format: () => {
        throw new Error("format error");
      },
    }));

    const { formatDate } = await import("src/common/dateUtils");
    expect(formatDate("2023-01-01", "YYYY-MM-DD")).toBe("");
  });
});
