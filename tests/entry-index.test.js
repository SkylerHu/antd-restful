describe("entry/index exports", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test("entry exports core APIs", async () => {
    const entry = await import("src/entry");

    expect(entry).toHaveProperty("RestTable");
    expect(entry).toHaveProperty("RestList");
    expect(entry).toHaveProperty("request");
    expect(entry).toHaveProperty("apiTools");
    expect(entry).toHaveProperty("setGlobalConfig");
    expect(entry).toHaveProperty("setRestOptions");
  });

  test("index default export proxies entry and logs debug", async () => {
    const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});

    const { default: exported } = await import("src/index");
    const entry = await import("src/entry");

    expect(exported).toBe(entry);
    expect(debugSpy).toHaveBeenCalledWith("组件库antdRestful包含", entry);
  });
});
