const { ipcMain, shell, Menu } = require('electron');
const YouTube                  = require('./YouTube');

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

        if(process.platform === 'darwin') {

            this.app.on('activate', () => this.window.getWindow().show());

            let appSubMenu = [{ label: "Quit", role: "quit" }];

            let editSubMenu = [
                { label: "Undo", role: "undo" },
                { label: "Redo", role: "redo" },
                { type: "separator" },
                { label: "Cut", role: "cut" },
                { label: "Copy", role: "copy" },
                { label: "Paste", role: "paste" },
                { label: "Select All", role: "selectAll" }
            ];

            if(process.env.NODE_ENV === 'development')
                editSubMenu.push({ label: "Refresh", role: "reload" });

            Menu.setApplicationMenu(Menu.buildFromTemplate([
                {
                    label: 'YTDownloader',
                    submenu: appSubMenu
                },
                {
                    label: 'Edit',
                    submenu: editSubMenu
                }
            ]));
        }
    }

    startWindowEvents() {
        ipcMain.on('TitleBar:Exit', e => {
            if(process.platform !== 'darwin')
                this.app.quit();
            else
                this.window.getWindow().hide();
        });
        ipcMain.on('TitleBar:Minimize', e => { 
            this.window.getWindow().minimize();
        });
        ipcMain.on('About:Link', (e, link) => {
            shell.openExternal(link);
        });
    }

    startMainEvents() {
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