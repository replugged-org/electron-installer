import { join } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";
import { DiscordPlatform } from "../../types";

const ProcessRegex: Record<DiscordPlatform, RegExp> = {
  stable: /discord$/i,
  ptb: /discord-?ptb$/i,
  canary: /discord-?canary$/i,
  development: /discord-?development$/i,
};

export const getAppDir = (platform: DiscordPlatform): string | null => {
  const homedir = process.env.HOME;
  const flatpakDir = "/var/lib/flatpak/app/com.discordapp";
  const homeFlatpakDir = `${homedir}/.local/share/flatpak/app/com.discordapp`;

  const KnownLinuxPaths: Record<DiscordPlatform, string[]> = {
    stable: [
      "/usr/share/discord",
      "/usr/lib64/discord",
      "/opt/discord",
      "/opt/Discord",
      `${flatpakDir}.Discord/current/active/files/discord`,
      `${homeFlatpakDir}.Discord/current/active/files/discord`,
      `${homedir}/.local/bin/Discord`,
    ],
    ptb: [
      "/usr/share/discord-ptb",
      "/usr/lib64/discord-ptb",
      "/opt/discord-ptb",
      "/opt/DiscordPTB",
      `${homedir}/.local/bin/DiscordPTB`,
    ],
    canary: [
      "/usr/share/discord-canary",
      "/usr/lib64/discord-canary",
      "/opt/discord-canary",
      "/opt/DiscordCanary",
      `${flatpakDir}.DiscordCanary/current/active/files/discord-canary`,
      `${homeFlatpakDir}.DiscordCanary/current/active/files/discord-canary`,
      `${homedir}/.local/bin/DiscordCanary`, // https://github.com/powercord-org/powercord/pull/370
    ],
    development: [
      "/usr/share/discord-development",
      "/usr/lib64/discord-development",
      "/opt/discord-development",
      "/opt/DiscordDevelopment",
      `${homedir}/.local/bin/DiscordDevelopment`,
    ],
  };

  const discordProcess = execSync("ps x")
    .toString()
    .split("\n")
    .map((s) => s.split(" ").filter(Boolean))
    .find((p) => p[4] && ProcessRegex[platform].test(p[4]) && p.includes("--type=renderer"));

  if (!discordProcess) {
    const discordPath = KnownLinuxPaths[platform].find((path) => existsSync(path));

    // TODO: Ask user for path
    if (!discordPath) return null;

    return join(discordPath, "resources", "app.asar");
  }

  const discordPath = discordProcess[4].split("/");
  discordPath.splice(discordPath.length - 1, 1);
  return join("/", ...discordPath, "resources", "app.asar");
};
