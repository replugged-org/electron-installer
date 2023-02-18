import { ipcMain } from "electron";
import { listInstallations, plug, unplug } from "./inject";
import { download } from "./inject/injector";

ipcMain.handle("GET_PLATFORMS", async () => {
  return await listInstallations();
});

ipcMain.handle("DOWNLOAD", (event) => {
  return download(event);
});

ipcMain.handle("PLUG", async (event, [platform]) => {
  try {
    return await plug(platform);
  } catch (e) {
    console.log("ERROR while plugging");
    console.log(e);
    event.sender.send("ERROR", e);
    return false;
  }
});

ipcMain.handle("UNPLUG", async (event, [platform]) => {
  try {
    return await unplug(platform);
  } catch (e) {
    console.log("ERROR while unplugging");
    console.log(e);
    event.sender.send("ERROR", e);
    return false;
  }
});
