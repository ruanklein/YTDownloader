const { app, BrowserWindow, ipcMain }   = require('electron');
const fs                                = require('fs');
const serve                             = require('electron-serve');
const ytdl                              = require('ytdl-core');
const ffmpeg                            = require('fluent-ffmpeg');

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

ipcMain.on('YouTube:Download', (e, data) => data.map(({ url, info, format }, index) => {
        const localfile = format === 'mp4' ? 
                          `${app.getPath('videos')}/${info.filename}.mp4` :
                          `${app.getPath('temp')}/${info.filename}.mp4`;


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
        .on('end', () => {
            if(format === 'mp3') {
                const fileReader = fs.createReadStream(localfile);
                ffmpeg(fileReader)
                    .withNoVideo()
                    .inputFormat('mp4')
                    .audioCodec('libmp3lame')
                    .audioBitrate(320)
                    .format('mp3')
                    .on('stderr', line => console.log(line))
                    .on('error', err => console.log(`[${index}:ffmpeg] err: ${err}`))
                    .on('end', () => fs.unlink(localfile, err => console.log(err)))
                    .save(fs.createWriteStream(`${app.getPath('music')}/${info.filename}.mp3`));
            }
        })
        .pipe(fs.createWriteStream(localfile));
    })
);