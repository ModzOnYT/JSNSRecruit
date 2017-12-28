const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const logger = require("./util/Logger");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    resizable: false,
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