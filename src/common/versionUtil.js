import { version as antdVersion } from "antd";
import { isString } from "./typeTools";
const DEFAULT_ANTD_MAJOR_VERSION = 5;

const parsedMajorVersion = isString(antdVersion) ? parseInt(antdVersion.split(".")[0], 10) : NaN;

export const antdMajorVersion = Number.isNaN(parsedMajorVersion) ? DEFAULT_ANTD_MAJOR_VERSION : parsedMajorVersion;
export const isAntd6Plus = antdMajorVersion >= 6;
export const isAntd5Plus = antdMajorVersion >= 5;

export function resolveSpaceOrientation(antdSpaceProps, defaultOrientation = "vertical") {
  if (isAntd6Plus) {
    return antdSpaceProps?.orientation || antdSpaceProps?.direction || defaultOrientation;
  }
  return antdSpaceProps?.direction || antdSpaceProps?.orientation || defaultOrientation;
}

export function getSpaceDirectionProps(antdSpaceProps, defaultOrientation = "vertical") {
  const orientation = resolveSpaceOrientation(antdSpaceProps, defaultOrientation);
  return isAntd6Plus ? { orientation } : { direction: orientation };
}

export { antdVersion };
