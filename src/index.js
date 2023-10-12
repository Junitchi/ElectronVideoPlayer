const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
require('electron-reload')(__dirname);
const isDev = require('electron-is-dev');
const path = require('path');
const { send } = require('process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      { 
        label: 'Open Video',
        click: openVideoFileDialog
      },
      // { label: 'Open Folder' },
      { label: 'Close',
        click: () => { app.quit(); } 
    }
    ]
  }))
  menu.append(new MenuItem({ label: 'Playback',
  submenu: [
    { 
      label: 'Play / Pause',
      click: () => sendToRenderer('toggle-play-pause')
    },
    // { label: 'Open Folder' },
    // { 
    //   label: 'Toggle Full Screen',
    //   click: sendToRenderer('toggle-full-screen')
    // },
    {
      label: 'Stop and Restart',
      click: () => sendToRenderer('stop-and-restart')
    },
    {
      label: 'Rewind',
      click: () => sendToRenderer('rewind')
    },
    {
      label: 'Fast Forward',
      click: () => sendToRenderer('fast-forward')
    },
    {
      label: 'Go to End',
      click: () => sendToRenderer('go-to-end')
    },
    {
      label: 'Toggle Mute',
      click: () => sendToRenderer('toggle-mute')
    },
    // {
    //   label: 'Change Playback Rate',
    //   click: () => sendToRenderer('change-playback-rate')
    // },
    // {
    //   label: 'Jump to Time',
    //   click: () => sendToRenderer('jump-to-time')
    // },
    // {
    //   label: 'Get Current Time',
    //   click: () => sendToRenderer('get-current-time')
    // },
    // {
    //   label: 'Get Duration',
    //   click: () => sendToRenderer('get-duration')
    // },
    // {
    //   label: 'Is Video Ended',
    //   click: () => sendToRenderer('is-video-ended')
    // },
    {
      label: 'Toggle Loop',
      click: () => sendToRenderer('toggle-loop')
    },
    // {
    //   label: 'Get Source',
    //   click: () => sendToRenderer('get-source')
    // }
  ] }))
  menu.append(new MenuItem({ label: 'About',
  submenu: [
    {
      label: 'Video Player App'
    },
    {
      label: 'Created by'
    },  
    {
      label: 'Jonathan R. Roman Velez'
    }
  ]

}))

  Menu.setApplicationMenu(menu)

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  function openVideoFileDialog() {
    const options = {
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'avi', 'mov'] },
        // Add more file types if needed
      ],
    };

    
    dialog.showOpenDialog(options).then((result) => {
      if (!result.canceled) {
        // Handle the selected file paths (result.filePaths)
        const selectedFilePaths = result.filePaths;
        // Send the selected file paths to the renderer process if needed
        if (mainWindow) {
          mainWindow.webContents.send('open-video-selector', selectedFilePaths);
        }
      }
    });
  }
  function handlePlayPause(){
    if (mainWindow) {
      mainWindow.webContents.send('handle-play-pause-video', selectedFilePaths);
    }
  }

  function sendToRenderer(listenerName, optionalParameter) {
    if (mainWindow) {
      mainWindow.webContents.send(listenerName, optionalParameter);
    }
  }

  // function toggleFullscreen() {
  //   if (mainWindow) {
  //     const webContents = mainWindow.webContents;
  //     webContents.enableFullscreen(); // Enable fullscreen permission
  //     webContents.send('toggle-full-screen');
  //   }
  // }
  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
