'use strict';
const electron = require('electron');
const app = electron.app;

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
    mainWindow = null;
}

function createMainWindow() {
    const main = new electron.BrowserWindow({
        width: 600,
        height: 600,
        icon: __dirname + "/assets/nexly.ico"
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