const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const logger = require("./util/Logger");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    minWidth: 846,
    minHeight: 480,
    height: 1280,
    width: 1024,
    resizable: true,
    title: "jsNSRecruit",
    autoHideMenuBar: true
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "core", "index.html"),
    protocol: "file:",
    slashes: true
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

process.on("unhandledRejection", logger.error);