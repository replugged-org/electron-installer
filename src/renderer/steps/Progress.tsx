import { DiscordPlatform } from "../types";
import { PLATFORM_LABELS, doAction } from "../util";
import { useEffect, useState } from "react";
import "./Progress.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

export function Progress({
  platforms,
  action,
  init,
}: {
  platforms: DiscordPlatform[];
  action: "plug" | "unplug";
  init: (reset?: boolean) => Promise<void>;
}): React.ReactElement {
  const navigate = useNavigate();

  const [done, setDone] = useState<DiscordPlatform[]>([]);
  const [error, setError] = useState<DiscordPlatform[]>([]);

  const allDone = done.length + error.length === platforms.length;
  const hasError = error.length > 0;

  const run = (): void => {
    setDone([]);
    setError([]);

    platforms.forEach(async (platform) => {
      const res = await doAction(platform, action);
      if (res) {
        setDone((prev) => [...prev, platform]);
      } else {
        setError((prev) => [...prev, platform]);
      }
    });
  };

  useEffect(run, []);

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
      {hasError && (
        <div className="progress-note">
          Please make sure Discord is closed and try again.
          <br />
          Need help? Join our{" "}
          <a target="_blank" href="https://discord.gg/replugged">
            Discord server
          </a>
          .
        </div>
      )}
      {allDone && (
        <div className="progress-bottom">
          {hasError ? (
            <button className="button button-secondary" onClick={run}>
              Try Again
            </button>
          ) : (
            <button
              className="button button-secondary"
              onClick={async () => {
                await init(true);
                navigate("/action");
              }}>
              Start Over
            </button>
          )}
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
