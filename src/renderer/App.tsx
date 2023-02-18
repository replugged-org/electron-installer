import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ChooseAction, Download, License } from "./steps";
import logo from "../../assets/logo.png";
import { useState } from "react";

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

  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<License />} />
          <Route path="/download" element={<Download />} />
          <Route path="/action" element={<ChooseAction action={action} setAction={setAction} />} />
        </Routes>
      </div>
    </Router>
  );
}
