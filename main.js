const { app, BrowserWindow } = require('electron');
const serve                  = require('electron-serve');

const isDev   = process.env.NODE_ENV === 'development';
const loadURL = serve({directory: 'build'});

let mainWindow = null;

if(require('electron-squirrel-startup'))    
    app.quit();

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minimizable: false,
        maximizable: false,
        resizable: false,
        title: 'DLMp3',
        icon: 'res/icon.ico',
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setMenu(null);
    mainWindow.on('close', () => mainWindow = null);

    if(isDev) {
        mainWindow.loadURL('http://localhost:3000');
        return;
    }

    loadURL(mainWindow);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if(mainWindow === null)
        createWindow();
});