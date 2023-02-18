import { Link } from "react-router-dom";
import { DiscordPlatform } from "../types";
import "./ChoosePlatform.css";
import "../App.css";
import { PLATFORM_LABELS } from "../util";

export function ChoosePlatform({
  availablePlatforms,
  platforms,
  setPlatforms,
}: {
  availablePlatforms: DiscordPlatform[];
  platforms: DiscordPlatform[];
  setPlatforms: (platforms: DiscordPlatform[]) => void;
}): React.ReactElement {
  const togglePlatform = (platform: DiscordPlatform): void => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  return (
    <div className="page platform-page">
      <div className="platform-page-header">Choose Platforms</div>
      <div className="choose-platform">
        {/* TODO: handle no platforms available */}
        {availablePlatforms.map((platform) => (
          <div
            key={platform}
            className={`button platform-button ${
              platforms.includes(platform) ? "platform-button-active" : ""
            }`}
            onClick={() => togglePlatform(platform)}>
            <span>{PLATFORM_LABELS[platform]}</span>
          </div>
        ))}
      </div>
      <div className="platform-bottom">
        <Link to="/action" className="button button-secondary">
          Back
        </Link>
        <Link to="/progress" className="button">
          Continue
        </Link>
      </div>
    </div>
  );
}
