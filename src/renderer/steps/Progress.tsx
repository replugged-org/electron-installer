import { DiscordPlatform } from "../types";
import { PLATFORM_LABELS, doAction } from "../util";
import { useEffect, useState } from "react";
import "./Progress.css";
import "../App.css";

export function Progress({
  platforms,
  action,
}: {
  platforms: DiscordPlatform[];
  action: "plug" | "unplug";
}): React.ReactElement {
  const [done, setDone] = useState<DiscordPlatform[]>([]);
  const [error, setError] = useState<DiscordPlatform[]>([]);

  const allDone = done.length + error.length === platforms.length;
  const hasError = error.length > 0;

  useEffect(() => {
    platforms.forEach(async (platform) => {
      const res = await doAction(platform, action);
      if (res) {
        setDone((prev) => [...prev, platform]);
      } else {
        setError((prev) => [...prev, platform]);
      }
    });
  }, []);

  return (
    <div className="page progress-page">
      <div className="progress-page-header">
        {allDone ? (hasError ? "Some actions failed" : "Done!") : "Please wait..."}
      </div>
      <div className="statuses">
        {platforms.map((platform) => (
          <div
            key={platform}
            className={`button progress-button ${
              done.includes(platform) ? "progress-button-done" : ""
            } ${error.includes(platform) ? "progress-button-error" : ""}`}>
            <span>{PLATFORM_LABELS[platform]}</span>
          </div>
        ))}
      </div>
      {allDone && (
        <div className="progress-bottom">
          <button
            className="button"
            onClick={() => {
              window.close();
            }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
