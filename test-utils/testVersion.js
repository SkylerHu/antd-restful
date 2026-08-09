export const DEFAULT_ANTD_TEST_VERSION = "5.22.5";
export const mockAntdVersion = process.env.ANTD_TEST_VERSION || DEFAULT_ANTD_TEST_VERSION;
export const mockAntdMajorVersion = parseInt(String(mockAntdVersion).split(".")[0], 10);
