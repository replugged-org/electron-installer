import { readdir } from "fs/promises";
import { join } from "path";
import { DiscordPlatform } from "../../types";

const PATHS: Record<DiscordPlatform, string> = {
  stable: "Discord",
  ptb: "DiscordPTB",
  canary: "DiscordCanary",
  development: "DiscordDevelopment",
};

export const getAppDir = async (platform: DiscordPlatform): Promise<string> => {
  const discordPath = join(process.env.LOCALAPPDATA!, PATHS[platform]);
  const discordDirectory = await readdir(discordPath);

  const currentBuild = discordDirectory.filter((path) => path.startsWith("app-")).reverse()[0];

  return join(discordPath, currentBuild, "resources", "app.asar");
};
