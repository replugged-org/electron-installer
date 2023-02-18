import { useEffect, useState } from "react";
import "./Download.css";
import "../App.css";

export function Download(): React.ReactElement {
  const { ipcRenderer } = window.electron;

  const [startTime, setStartTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"loading" | "downloading" | "done" | "error">("loading");

  useEffect(() => {
    console.log("useEffect");
    setStartTime(Date.now());
    void ipcRenderer.invoke("DOWNLOAD");
  }, []);

  useEffect(() => {
    const listeners: Array<() => void> = [];

    listeners.push(
      ipcRenderer.on("DOWNLOAD_PROGRESS", (progress) => {
        setStep("downloading");
        setProgress(progress as number);
      }),
    );
    listeners.push(
      ipcRenderer.on("DOWNLOAD_DONE", () => {
        const waitTime = 1000 - (Date.now() - startTime);
        if (waitTime > 0) {
          const timeout = setTimeout(() => setStep("done"), waitTime);
          listeners.push(() => clearTimeout(timeout));
        } else {
          setStep("done");
        }
      }),
    );
    listeners.push(ipcRenderer.on("DOWNLOAD_ERROR", () => setStep("error")));

    return () => {
      listeners.forEach((listener) => listener());
    };
  });

  return (
    <div className="page">
      <div className="download-progress">
        <div className="download-progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="download-step">
        {step === "loading" && "Loading..."}
        {step === "downloading" && `Downloading... ${Math.floor(progress * 100)}%`}
        {step === "done" && "Done!"}
        {step === "error" && "Error!"}
      </div>
    </div>
  );
}
