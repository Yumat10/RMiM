import path from "path";
import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import "../server/src";
import { startOllama } from "./helpers/startOllama";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  // const mainWindow = createWindow("main", {
  //   width: 1512,
  //   height: 982,
  //   webPreferences: {
  //     preload: path.join(__dirname, "preload.js"),
  //   },
  // });

  // if (isProd) {
  //   await mainWindow.loadURL("app://./home");
  // } else {
  //   const port = process.argv[2];
  //   await mainWindow.loadURL(`http://localhost:${port}/home`);
  //   mainWindow.webContents.openDevTools();
  // }
})();

app.on("ready", () => {
  // startOllama();

  // Register a shortcut for going back
  const backShortcutKey =
    process.platform === "darwin" ? "Cmd+[" : "Ctrl+Backspace";
  globalShortcut.register(backShortcutKey, () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && focusedWindow.webContents.canGoBack()) {
      focusedWindow.webContents.goBack();
    }
  });

  // Register a shortcut for going forward
  const forwardShortcutKey =
    process.platform === "darwin" ? "Cmd+]" : "Ctrl+Shift+Backspace";
  globalShortcut.register(forwardShortcutKey, () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && focusedWindow.webContents.canGoForward()) {
      focusedWindow.webContents.goForward();
    }
  });
});

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
