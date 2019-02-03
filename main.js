const { app, BrowserWindow, ipcMain }   = require('electron');
const serve                             = require('electron-serve');

const YouTube                           = require('./lib/YouTube');

const isDev   = process.env.NODE_ENV === 'development';
const loadURL = serve({directory: 'build'});

let mainWindow = null;

if(require('electron-squirrel-startup'))    
    app.quit();

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minimizable: process.platform !== 'darwin',
        maximizable: false,
        resizable: false,
        title: 'YTDownloader',
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

ipcMain.on('YouTube:Info', (e, url) => {
    const ytConverter = new YouTube(e, { url });
    ytConverter.getInfo();
});

ipcMain.on('YouTube:Download', (e, data) => {

    let ytConverter = [];

    data.map(({ url, info, format }, index) => {

        const audioFile = format === 'mp3' ? 
                          `${app.getPath('downloads')}/${info.filename}.mp3` :
                          `${app.getPath('temp')}/${info.filename}.mp4`;


        ytConverter.push(new YouTube(e, {
            url,
            index,
            format,
            audioFile,
            videoFile: `${app.getPath('downloads')}/${info.filename}.mp4`
        }));
    });

    ytConverter.map(converter => converter.run());
});