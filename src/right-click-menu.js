// tools.js
const { app, BrowserWindow, Menu, MenuItem, dialog, globalShortcut, Notification, ipcMain } = require('electron');
module.exports = {
    contextMenu: function () {
      // whatever
      console.log("right click context initialized")
      const contextMenu = new Menu()
      contextMenu.append(new MenuItem({ label: 'Open Video', click() { openVideoFileDialog() } }))
    
      contextMenu.append(new MenuItem({ type: 'separator' }))
    
      contextMenu.append(new MenuItem({ label: 'Play/Pause', click() { sendToRenderer('toggle-play-pause') } }))
      contextMenu.append(new MenuItem({ label: 'Stop and Restart', click() { sendToRenderer('stop-and-restart') } }))
      contextMenu.append(new MenuItem({ label: 'Rewind', click() { sendToRenderer('rewind') } }))
      contextMenu.append(new MenuItem({ label: 'Fastforward', click() { sendToRenderer('fast-forward') } }))
      contextMenu.append(new MenuItem({ label: 'Go to end', click() { sendToRenderer('go-to-end') } }))
      contextMenu.append(new MenuItem({ label: 'Mute/Unmute', click() { sendToRenderer('toggle-mute') } }))
      contextMenu.append(new MenuItem({ label: 'Loop/Unloop', click() { sendToRenderer('toggle-loop') } }))
    
      contextMenu.append(new MenuItem({ type: 'separator' }))
    
      contextMenu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
      return contextMenu;
    },
    bar: function () {
      // whatever
    }
  };
  