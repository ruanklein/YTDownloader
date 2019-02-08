const { BrowserWindow } = require('electron');
const serve             = require('electron-serve');

const loadURL = serve({directory: 'build'});

let mainWindow = null;

class MainWindow {
    createWindow() {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
    
        mainWindow.on('close', () => mainWindow = null);

        if(process.env.NODE_ENV === 'development') {
            mainWindow.loadURL('http://localhost:3000');
            return;
        }
    
        loadURL(mainWindow);
    }

    getWindow() {
        return mainWindow;
    }
}

module.exports = MainWindow;