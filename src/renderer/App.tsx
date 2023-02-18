import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Download, License } from "./steps";
import logo from "../../assets/logo.png";

function Header(): React.ReactElement {
  return (
    <div className="header">
      <img src={logo} alt="Replugged logo" className="header-logo" />
      <span className="header-name">Replugged Installer</span>
    </div>
  );
}

export default function App(): React.ReactElement {
  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<License />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </div>
    </Router>
  );
}
