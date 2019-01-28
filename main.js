const { app, BrowserWindow, ipcMain } = require('electron');
const { createWriteStream }           = require('fs');
const serve                           = require('electron-serve');
const ytdl                            = require('ytdl-core');

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

ipcMain.on('YouTube:Info', (e, url) => ytdl.getBasicInfo(url, (err, info) => {

   const fmtTime = s => (s-(s %= 60)) / 60 + (9 < s ? ':' : ':0' ) + s;

   // for mp3 conversion
   // const makeTmpFile = () => {
   //   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   //   let text = '';

   //   for(let i = 0; i <= 8; i++)
   //     text += possible.charAt(Math.floor(Math.random()*possible.length));

   //    return text;
   //  }

   let data = {
       error: true,
       info: {}
   };

   if(err) {
       e.sender.send('YouTube:Info:Data', data);
       return;
   }

   const { title, description, length_seconds } = info;
   const filename = title.replace(/\s+/g, '_').replace(/\W/g, '');

   data = {
        error: false,
        info: {
            title: `${title.substring(0,50)} ...`,
            description: `${description.substring(0,100)} ...`,
            duration: fmtTime(length_seconds),
            filename
        }
    };

    e.sender.send('YouTube:Info:Data', data);
    })
);

ipcMain.on('YouTube:Download', (e, data) => data.map(({ url, info }, index) => {
        ytdl(url, { filter: ({ container }) => container === 'mp4' })
        .on('response', res => {
            const size = res.headers['content-length'];
            let pos = 0;

            res.on('data', chunk => {
                pos += chunk.length;
                let progress = ((pos / size) * 100).toFixed(0);
                e.sender.send('YouTube:Download:Progress', index, progress);
            });
        })
        .pipe(createWriteStream(`${app.getPath('videos')}/${info.filename}.mp4`));
    })
);