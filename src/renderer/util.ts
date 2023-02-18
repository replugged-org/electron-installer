import { DiscordPlatform, PlatformData } from "./types";

export async function getPlatforms(): Promise<Record<DiscordPlatform, PlatformData>> {
  const { ipcRenderer } = window.electron;

  return await ipcRenderer.invoke("GET_PLATFORMS");
}

export async function doAction(
  platform: DiscordPlatform,
  action: "plug" | "unplug",
): Promise<boolean> {
  const { ipcRenderer } = window.electron;

  if (action === "plug") {
    return await ipcRenderer.invoke("PLUG", platform);
  }
  if (action === "unplug") {
    return await ipcRenderer.invoke("UNPLUG", platform);
  }

  throw new Error("Invalid action");
}

export const PLATFORM_LABELS: Record<DiscordPlatform, string> = {
  stable: "Discord Stable",
  ptb: "Discord PTB",
  canary: "Discord Canary",
  development: "Discord Development",
};
