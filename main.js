const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const robotjs = require("robotjs");

// let inSession = false;
console.log(process.version);
let win = null;
function createWindow() {
  win = new BrowserWindow({
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
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// this function scales the x and y coordinates for the appropriate screen
function scaleXY(x, y, elementWidth, elementHeight, screenHeight, screenWidth) {
  const newX = parseInt((elementWidth / screenWidth) * x);
  const newY = parseInt((elementHeight / screenHeight) * y);

  return {
    x: newX,
    y: newY,
  };
}

const template = [
  {
    label: "Session",
    submenu: [
      {
        label: "End session",
        enabled: false,
        click() {
          template[0].submenu[0].enabled = false;
          win.unmaximize()
          buildMenu(template);
          win.webContents.send("endSession");
        },
      },
    ],
  },

  isDev && {
    label: "Dev",
    submenu: [
      {
        label: "Dev",
        role: "toggleDevTools",
      },

      {
        label: "Reload",
        role: "reload"
      }
    ],
  },
];

buildMenu(template);

ipcMain.on("updateMenuItem", (event, inSession) => {
  template[0].submenu[0].enabled = inSession;
  buildMenu(template);

  if (inSession) {
    win.maximize();
  } else {
    win.unmaximize();
  }
});

ipcMain.on("remoteEvent", (event, payload) => {
  switch (payload.type) {
    case "mousemove":
      const { clientX, clientY, elementHeight, elementWidth } = payload;
      const {
        width: screenWidth,
        height: screenHeight,
      } = screen.getPrimaryDisplay().size; // should i make this global
      const { x, y } = scaleXY(
        clientX,
        clientY,
        elementWidth,
        elementHeight,
        screenHeight,
        screenWidth
      );

      robotjs.moveMouseSmooth(x, y);
      break;
    case "mousedown":
      const { mouseClickType, doubleClick } = payload;
      robotjs.mouseClick(mouseClickType, doubleClick)
      break;
      
    case "keydown":
      // TODO: Support modifires
      const { key } = payload;
      robotjs.keyTap(key.toLowerCase());
    // code block
  }
});

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
