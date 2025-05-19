const { exec } = require("child_process");
const { App } = require("electron");
const { readFile } = require("fs");
const { release } = require("os");

const sdkVersion = `aptabase-electron@${process.env.PKG_VERSION}`;



module.exports.getEnvironmentInfo = async function(app) {
  const [osName, osVersion] = await getOperatingSystem();

  return {
    appVersion: app.getVersion(),
    isDebug: !app.isPackaged,
    locale: app.getLocale(),
    osName,
    osVersion,
    engineName: "Chromium",
    engineVersion: process.versions.chrome,
    sdkVersion,
  };
}

async function getOperatingSystem() {
  switch (process.platform) {
    case "win32":
      return ["Windows", release()];
    case "darwin":
      const macOSVersion = await getMacOSVersion();
      return ["macOS", macOSVersion];
    default:
      return await getLinuxInfo();
  }
}

async function getMacOSVersion() {
  try {
    const output = await new Promise<string>((resolve, reject) => {
      exec(
        "/usr/bin/sw_vers -productVersion",
        (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
    return output.trim();
  } catch (ex) {
    return "";
  }
}

async function getLinuxInfo() {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      readFile(
        "/etc/os-release",
        "utf8",
        (error, output) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(output);
        }
      );
    });

    const lines = content.split("\n");
    const osData = {};
    for (const line of lines) {
      const [key, value] = line.split("=");
      if (key && value) {
        osData[key] = value.replace(/"/g, ""); // Remove quotes if present
      }
    }
    const osName = osData["NAME"] ?? "Linux";
    const osVersion = osData["VERSION_ID"] ?? "";
    return [osName, osVersion];
  } catch {
    return ["Linux", ""];
  }
}