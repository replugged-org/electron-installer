export const PLATFORMS = ["stable", "ptb", "canary", "development"] as const;
export type DiscordPlatform = "stable" | "ptb" | "canary" | "development";

export type PlatformData =
  | {
      installed: false;
      plugged: boolean;
      path: null;
    }
  | {
      installed: true;
      plugged: boolean;
      path: string;
    };

export enum IpcEvents {
  GET_PLATFORMS = "GET_PLATFORMS",
}
