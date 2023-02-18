import { mkdir, rename, rm, stat, writeFile } from "fs/promises";
import { join, sep } from "path";
import fetch from "node-fetch";
import { IpcMainInvokeEvent } from "electron";

const DOWNLOAD_URL =
  "https://github.com/replugged-org/replugged/releases/latest/download/replugged.asar";

export const isDiscordInstalled = async (appDir: string): Promise<boolean> => {
  try {
    await stat(appDir);
    return true;
  } catch {
    return false;
  }
};

// If app.orig.asar but no app.asar, move app.orig.asar to app.asar
// Fixes a case where app.asar was deleted (unplugged) but app.orig.asar couldn't be moved back
export const correctMissingMainAsar = async (appDir: string): Promise<boolean> => {
  try {
    await stat(join(appDir, "..", "app.orig.asar"));
    try {
      await stat(join(appDir, "..", "app.asar"));
    } catch {
      try {
        await rename(join(appDir, "..", "app.orig.asar"), join(appDir, "..", "app.asar"));
      } catch {
        return false;
      }
    }
  } catch {}

  return true;
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

  res.body.on("end", async () => {
    await writeFile(entryPoint, Buffer.concat(chunks));

    event.sender.send("DOWNLOAD_DONE");
  });
};

export const inject = async (appDir: string): Promise<boolean> => {
  const entryPoint = join(getConfigDir(), "replugged.asar");

  if (!(await correctMissingMainAsar(appDir))) return false;
  if (!(await isDiscordInstalled(appDir))) return false;

  if (appDir.includes("flatpak")) {
    // TODO
    return false;
  }

  try {
    await rename(appDir, join(appDir, "..", "app.orig.asar"));
  } catch {
    return false;
  }

  await mkdir(appDir);
  await Promise.all([
    writeFile(
      join(appDir, "index.js"),
      `require("${entryPoint.replace(RegExp(sep.repeat(2), "g"), "/")}")`,
    ),
    writeFile(
      join(appDir, "package.json"),
      JSON.stringify({
        main: "index.js",
        name: "discord",
      }),
    ),
  ]);

  return true;
};

export const uninject = async (appDir: string): Promise<boolean> => {
  if (
    !(await isDiscordInstalled(appDir)) &&
    !(await isDiscordInstalled(join(appDir, "..", "app.orig.asar")))
  )
    return false;

  await rm(appDir, { recursive: true, force: true });
  await rename(join(appDir, "..", "app.orig.asar"), appDir);
  return true;
};
