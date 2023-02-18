import { useState } from "react";
import "./ChooseAction.css";
import "../App.css";
import { Link } from "react-router-dom";

export function ChooseAction({
  action,
  setAction,
}: {
  action: "plug" | "unplug";
  setAction: (action: "plug" | "unplug") => void;
}): React.ReactElement {
  return (
    <div className="page action-page">
      <div className="action-page-header">Choose Action</div>
      <div className="choose-action">
        <div
          className={`button action-button ${action === "plug" ? "action-button-active" : ""}`}
          onClick={() => setAction("plug")}>
          <span>Plug</span>
        </div>
        <div
          className={`button action-button ${action === "unplug" ? "action-button-active" : ""}`}
          onClick={() => setAction("unplug")}>
          <span>Unplug</span>
        </div>
      </div>
      <div className="action-bottom">
        <Link to="/platform" className="button">
          Continue
        </Link>
      </div>
    </div>
  );
}
