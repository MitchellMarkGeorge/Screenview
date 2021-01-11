const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// let inSession = false;
console.log(process.version);
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // file transfer (drag and drop???)
  win.loadURL(
    isDev
      ? "http://localhost:8080"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

function buildMenu(template) {
  if (isDev) {
    template.push({
      label: "Dev",
      submenu: [
        {
          label: "Dev",
          role: "toggleDevTools",
        },
      ],
    });
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

const template = [
  {
    label: "Session",
    submenu: [
      {
        label: "End session",
        enabled: false,
      },
    ],
  },
];



buildMenu(template);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
