const { ipcMain, shell } = require('electron');
const YouTube            = require('./YouTube');

class Event {
    constructor(app, window) {
        this.app    = app;
        this.window = window;
    }

    handleStartUpEvent() {
        if(process.platform !== 'win32')
            return false;
    
        switch(process.argv[1]) {
            case '--squirrel-install':
            case '--squirrel-updated':

                const destDir   = `${this.app.getPath('appData')}/bin`;
                const destFile  = `${destDir}/ffmpeg.exe`;
            
                if(!fs.existsSync(destDir))
                    fs.mkdirSync(destDir, err => console.log(`mkdir: ${err}`));
            
                fs.copyFileSync(`${this.app.getAppPath()}/res/bin/ffmpeg-win.exe`, destFile);

                this.app.quit();
                return true;
            case '--squirrel-uninstall':
            case '--squirrel-obsolete':
                this.app.quit();
                return true;
        }
    }

    startAppEvents() {
        this.app.on('ready', this.window.createWindow);
    }

    startWindowEvents() {
        ipcMain.on('TitleBar:Exit', e => {
            this.app.quit()
        });
        ipcMain.on('TitleBar:Minimize', e => { 
            this.window.getWindow().minimize()
        });
        ipcMain.on('About:Link', (e, link) => {
            shell.openExternal(link)
        });
    }

    startYouTubeEvents(ffmpegBin) {
        ipcMain.on('YouTube:Info', (e, url) => {
            const ytConverter = new YouTube(e, { url });
            ytConverter.getInfo();
        });
        
        ipcMain.on('YouTube:Download', (e, data) => data.map(({ url, info, format }, index) => {
        
                const audioFile = format === 'mp3' ? 
                                    `${this.app.getPath('downloads')}/${info.filename}.mp3` :
                                    `${this.app.getPath('temp')}/${info.filename}.mp4`;
        
                const ytConverter = new YouTube(e, {
                    url,
                    index,
                    format,
                    audioFile,
                    videoFile: `${this.app.getPath('downloads')}/${info.filename}.mp4`,
                    ffmpegBin
                });
                ytConverter.run();
            })
        );
    }
}

module.exports = Event;