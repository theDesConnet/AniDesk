const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('titleBarAPI', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
});

contextBridge.exposeInMainWorld('analytics', {
  trackEvent: (eventName, props) => ipcRenderer.invoke("analytics:trackEvent", eventName, props)
});

contextBridge.exposeInMainWorld('winApi', {
  openLink: (link) => ipcRenderer.invoke('winApi:openLink', link),
});

contextBridge.exposeInMainWorld('Sibnet', {
  Parse: (link) => ipcRenderer.invoke('sibnet:parse', link),
});

contextBridge.exposeInMainWorld('elecWindow', {
  getSize: () => ipcRenderer.invoke('window:getSize'),
  exitFullscreen: () => ipcRenderer.invoke('window:leaveFullScreen'),
  enterFullscreen: () => ipcRenderer.invoke('window:enterFullScreen'),
});

contextBridge.exposeInMainWorld('netElec', {
  fetch: (url, requestInfo) => ipcRenderer.invoke('netElec:fetch', url, requestInfo),
});

contextBridge.exposeInMainWorld('prc', {
  getVersions: () => ipcRenderer.invoke('prc:getVersions'),
});

contextBridge.exposeInMainWorld('discordRPC', {
  setActivity: (activity) => ipcRenderer.invoke('discordRPC:setActivity', activity),
});

contextBridge.exposeInMainWorld('settings', {
  getAll: () => ipcRenderer.invoke('settings:getAll'),
  get: (key) => ipcRenderer.invoke('settings:get', key),
  set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
});