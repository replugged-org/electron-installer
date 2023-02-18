import { Link, Route, MemoryRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Download } from "./Download";

function Start(): React.ReactElement {
  return (
    <div className="start-container">
      <Link to="/download">Download</Link>
    </div>
  );
}

export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
}
