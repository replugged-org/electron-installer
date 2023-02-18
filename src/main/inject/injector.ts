import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "original-fs";
import { join, sep } from "path";
import fetch from "node-fetch";
import { IpcMainInvokeEvent } from "electron";

const DOWNLOAD_URL =
  "https://github.com/replugged-org/replugged/releases/latest/download/replugged.asar";

const moveToOrig = (appDir: string): void => {
  // Check if we need to move app.asar to app.orig.asar
  if (!existsSync(join(appDir, "..", "app.orig.asar"))) {
    renameSync(appDir, join(appDir, "..", "app.orig.asar"));
  }

  // In case app.asar still exists, delete it
  if (existsSync(appDir)) {
    rmSync(appDir, {
      recursive: true,
      force: true,
    });
  }
};

const getConfigDir = (): string => {
  switch (process.platform) {
    case "win32":
      return join(process.env.APPDATA || "", "replugged");
    case "darwin":
      return join(process.env.HOME || "", "Library", "Application Support", "replugged");
    default:
      if (process.env.XDG_CONFIG_HOME) {
        return join(process.env.XDG_CONFIG_HOME, "replugged");
      }
      return join(process.env.HOME || "", ".config", "replugged");
  }
};

export const download = async (event: IpcMainInvokeEvent): Promise<void> => {
  const entryPoint = join(getConfigDir(), "replugged.asar");

  const res = await fetch(DOWNLOAD_URL).catch(() => {
    event.sender.send("DOWNLOAD_ERROR");
  });
  if (!res) return;
  if (!res.body) return;

  event.sender.send("DOWNLOAD_PROGRESS", 0);

  // Emit progress events
  const total = Number(res.headers.get("content-length"));
  const chunks: Buffer[] = [];
  let downloaded = 0;
  res.body.on("data", (chunk) => {
    chunks.push(chunk);
    downloaded += chunk.length;
    event.sender.send("DOWNLOAD_PROGRESS", downloaded / total);
  });

  res.body.on("end", () => {
    if (!existsSync(getConfigDir())) mkdirSync(getConfigDir());
    writeFileSync(entryPoint, Buffer.concat(chunks));

    event.sender.send("DOWNLOAD_DONE");
  });
};

export const inject = (appDir: string): void => {
  const entryPoint = join(getConfigDir(), "replugged.asar");

  if (appDir.includes("flatpak")) {
    throw new Error("Flatpak is not supported yet");
    // TODO
  }

  moveToOrig(appDir);

  mkdirSync(appDir);
  writeFileSync(
    join(appDir, "index.js"),
    `require("${entryPoint.replace(RegExp(sep.repeat(2), "g"), "/")}")`,
  );
  writeFileSync(
    join(appDir, "package.json"),
    JSON.stringify({
      main: "index.js",
      name: "discord",
    }),
  );
};

export const uninject = (appDir: string): void => {
  rmSync(appDir, { recursive: true, force: true });
  renameSync(join(appDir, "..", "app.orig.asar"), appDir);
};
