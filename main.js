const { app, BrowserWindow, ipcMain, shell }   = require('electron');
const serve                                    = require('electron-serve');

const YouTube                                  = require('./lib/YouTube');

const isDev   = process.env.NODE_ENV === 'development';
const loadURL = serve({directory: 'build'});

let mainWindow = null;

if(require('electron-squirrel-startup'))    
    app.quit();

const getFfmpegBin = () => {
    switch(process.platform) {
        case 'win32':
            return `${app.getAppPath()}/res/bin/ffmpeg-win.exe`;
        case 'darwin':
            return `${app.getAppPath()}/res/bin/ffmpeg-mac`;
        default:
            return null;
    }
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: isDev
        }
    });

    mainWindow.setMenu(null);
    mainWindow.on('close', () => mainWindow = null );

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

ipcMain.on('YouTube:Download', (e, data) => data.map(({ url, info, format }, index) => {

        const audioFile = format === 'mp3' ? 
                          `${app.getPath('downloads')}/${info.filename}.mp3` :
                          `${app.getPath('temp')}/${info.filename}.mp4`;

        const ytConverter = new YouTube(e, {
            url,
            index,
            format,
            audioFile,
            videoFile: `${app.getPath('downloads')}/${info.filename}.mp4`,
            ffmpegBin: getFfmpegBin()
        });
        ytConverter.run();
    })
);

ipcMain.on('TitleBar:Exit', e => app.quit());
ipcMain.on('TitleBar:Minimize', e => mainWindow.minimize());
ipcMain.on('About:Link', (e, link) => shell.openExternal(link));