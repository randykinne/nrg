'use strict';
const electron = require('electron');
const app = electron.app;
const { ipcMain } = require('electron');

// Prevent window being garbage collected
let mainWindow;
let resultWindow;

const windowSettings = {
    width: 600,
    height: 600,
    show: false
}

function onClosed() {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = null;
    resultWindow = null;
}

function createResultWindow() {
    const result = new electron.BrowserWindow({
        width: 500,
        height: 400
    })

    result.loadURL(`file://${__dirname}/result.html`)

    return result;
}

function createMainWindow() {
    const main = new electron.BrowserWindow({
        width: 600,
        height: 600
    });

    ipcMain.on('request-update-label-in-second-window', (event, arg) => {
        // Request to update the label in the renderer process of the second window
        if (resultWindow !== null) {
            resultWindow = createResultWindow();
        }
        resultWindow.webContents.send('action-update-label', arg);
    });

    main.loadURL(`file://${__dirname}/index.html`);
    main.on('closed', onClosed);

    return main;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();
});