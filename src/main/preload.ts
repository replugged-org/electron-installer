// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { IpcEvents } from "./types";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IpcEvents, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: IpcEvents, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]): void => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IpcEvents, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: IpcEvents, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
