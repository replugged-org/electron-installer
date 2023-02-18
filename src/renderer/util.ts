import { DiscordPlatform, PlatformData } from "./types";

export async function getPlatforms(): Promise<Record<DiscordPlatform, PlatformData>> {
  const { ipcRenderer } = window.electron;

  return await ipcRenderer.invoke("GET_PLATFORMS");
}
