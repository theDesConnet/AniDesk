const { app, BrowserWindow, ipcMain, net, autoUpdater, dialog } = require('electron')
const path = require('node:path')
const o = require('openurl');
const serve = require('electron-serve').default;
const loadURL = serve({ directory: './public' });
const fs = require('fs');
const rpc = require("@xhayper/discord-rpc");
const { initialize, trackEvent } = require("./aptabase/main");
const { SibnetParser } = require('anixartjs');
/**
 * @type {BrowserWindow}
 */
let mainWindow;

const server = 'https://update.electronjs.org'
const feed = `${server}/theDesConnet/AniDesk/${process.platform}-${process.arch}/${app.getVersion()}`
const UserAgent = "AnixartApp/9.0 BETA 3-25021818 (Android 9; SDK 28; x86_64; ROG ASUS AI2201_B; ru)";
const rpcClientId = '1372649290438148137';
const SettingsPath = path.join(app.getPath("userData"), "settings.json");
const DefaultSettings = {
  AutoUpdate: true,
  EnableAnalytics: true,
  EnableRPC: false,
  EnableDevTools: false
};

const discordRpcClient = new rpc.Client({
  clientId: rpcClientId,
  transport: 'ipc'
})

discordRpcClient.on('ready', () => {
  console.log("[RPC] Hooked!");
});

const SettingsFirst = fs.existsSync(SettingsPath) ? JSON.parse(fs.readFileSync(SettingsPath)) : DefaultSettings;

if (SettingsFirst.AutoUpdate) {
  autoUpdater.on("checking-for-update", () => {
    console.log("checking-for-update");
  });

  autoUpdater.on("update-available", () => {
    console.log("update-available");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("update-not-available");
  });

  autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Обновление AniDesk',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'Новая версия была скачана, перезапустите приложение для установки.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.setFeedURL(feed);
  autoUpdater.checkForUpdates();
}

if (require('electron-squirrel-startup')) app.quit();

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

if (SettingsFirst.EnableRPC) discordRpcClient.login().catch(console.error);

if (SettingsFirst.EnableAnalytics) {
  initialize("A-EU-5850138901");
  trackEvent("app_started");
}

function isDev() {
  return !app.isPackaged;
}

function UpsertKeyValue(obj, keyToChange, value) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      obj[key] = value;
      return;
    }
  }

  obj[keyToChange] = value;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      devTools: SettingsFirst.EnableDevTools
    },
    icon: "./public/assets/icons/anidesk-icon.png",
    show: false,
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:8080/');
  } else {
    loadURL(mainWindow);
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  mainWindow.once('ready-to-show', async () => {
    mainWindow.show()
  });

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { url, requestHeaders } = details;
      const host = new URL(url).host;

      UpsertKeyValue(requestHeaders, 'Referer', null);
      UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);

      if (host == "video.sibnet.ru") {
        UpsertKeyValue(requestHeaders, 'Referer', url);
      }

      if (host !== "kodik.info" && host !== "video.sibnet.ru") {
        UpsertKeyValue(requestHeaders, 'sec-ch-ua-platform', "Android");
        UpsertKeyValue(requestHeaders, 'sec-ch-ua-mobile', "?1");
        UpsertKeyValue(requestHeaders, 'sec-ch-ua', "AnixartApp");
        UpsertKeyValue(requestHeaders, 'User-Agent', UserAgent)
      };
      callback({ requestHeaders });
    },
  );

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    callback({
      responseHeaders,
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
})

ipcMain.handle("analytics:trackEvent", (_, eventName, props) => {
  trackEvent(eventName, props);
})
ipcMain.handle("settings:get", (_, key) => {
  const settings = fs.existsSync(SettingsPath) ? JSON.parse(fs.readFileSync(SettingsPath)) : DefaultSettings;

  return settings?.[key] ?? null;
})

ipcMain.handle("settings:set", (_, key, value) => {
  const settings = fs.existsSync(SettingsPath) ? JSON.parse(fs.readFileSync(SettingsPath)) : DefaultSettings;

  settings[key] = value;
  fs.writeFileSync(SettingsPath, JSON.stringify(settings));
})

ipcMain.handle("settings:getAll", (_) => {
  return fs.existsSync(SettingsPath) ? JSON.parse(fs.readFileSync(SettingsPath)) : DefaultSettings;
})

ipcMain.handle("window:minimize", (_) => {
  mainWindow.minimize();
});

ipcMain.handle("window:maximize", (_) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle("window:close", (_) => {
  mainWindow.close();
});

ipcMain.handle("window:getSize", (_) => {
  return mainWindow.getSize();
});

ipcMain.handle("window:enterFullScreen", (_) => {
  mainWindow.setFullScreen(true);
})

ipcMain.handle("window:leaveFullScreen", (_) => {
  mainWindow.setFullScreen(false);
})

ipcMain.handle("sibnet:parse", async (_, link) => {
  const res = await SibnetParser.getDirectLink(link);
  return res;
})

ipcMain.handle("winApi:openLink", (_, link) => {
  o.open(link);
});

ipcMain.handle("discordRPC:setActivity", (_, activity) => {
  if (SettingsFirst.EnableRPC) discordRpcClient.user?.setActivity(activity).then(() => console.log("[RPC] Activity set!")).catch(console.error);
  else console.log("[RPC] Disabled");
});

ipcMain.handle("prc:getVersions", (_) => {
  return {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    anidesk: app.getVersion(),
    node: process.versions.node
  };
})