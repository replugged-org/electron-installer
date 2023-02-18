import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ChooseAction, ChoosePlatform, Download, License, Progress } from "./steps";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { DiscordPlatform } from "./types";
import { getPlatforms } from "./util";

function Header(): React.ReactElement {
  return (
    <div className="header">
      <img src={logo} alt="Replugged logo" className="header-logo" />
      <span className="header-name">Replugged Installer</span>
    </div>
  );
}

export default function App(): React.ReactElement {
  const [action, setAction] = useState<"plug" | "unplug">("plug");
  const [platforms, setPlatforms] = useState<DiscordPlatform[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<DiscordPlatform[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on("ERROR", (event) => {
      console.error(event);
    });

    getPlatforms()
      .then((data) => {
        const platforms = Object.entries(data)
          .filter(([, value]) => value.installed)
          .map(([key]) => key as DiscordPlatform);

        setAvailablePlatforms(platforms);
        if (platforms[0]) {
          setPlatforms([platforms[0]]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<License />} />
          <Route path="/download" element={<Download />} />
          <Route path="/action" element={<ChooseAction action={action} setAction={setAction} />} />
          <Route
            path="/platform"
            element={
              <ChoosePlatform
                availablePlatforms={availablePlatforms}
                platforms={platforms}
                setPlatforms={setPlatforms}
              />
            }
          />
          <Route path="/progress" element={<Progress action={action} platforms={platforms} />} />
        </Routes>
      </div>
    </Router>
  );
}
