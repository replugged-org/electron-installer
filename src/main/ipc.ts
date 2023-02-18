import { ipcMain } from "electron";
import { listInstallations } from "./inject";
import { download } from "./inject/injector";

ipcMain.handle("GET_PLATFORMS", async () => {
  return await listInstallations();
});

ipcMain.handle("DOWNLOAD", (event) => {
  return download(event);
});
