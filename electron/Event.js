const { ipcMain, shell } = require('electron');
const YouTube            = require('./YouTube');

class Event {
    constructor(app, window) {
        this.app     = app;
        this.window  = window;
    }

    handleStartUpEvent() {
        if(process.platform !== 'win32')
            return false;
    
        switch(process.argv[1]) {
            case '--squirrel-install':
            case '--squirrel-updated':
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

    startYouTubeEvents() {
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
                    videoFile: `${this.app.getPath('downloads')}/${info.filename}.mp4`
                });
                ytConverter.run();
            })
        );
    }
}

module.exports = Event;