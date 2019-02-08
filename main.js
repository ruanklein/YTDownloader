const { app }     = require('electron');

const MainWindow  = require('./electron/MainWindow');
const Event       = require('./electron/Event');

let ffmpegBin;

switch(process.platform) {
    case 'win32':
        ffmpegBin = `${app.getPath('appData')}/res/bin/ffmpeg.exe`;
    default:
        ffmpegBin = `${app.getPath('appData')}/res/bin/ffmpeg`;
}

const event  = new Event(app, new MainWindow);

if(event.handleStartUpEvent())
    return;

event.startAppEvents();
event.startWindowEvents();
event.startYouTubeEvents(ffmpegBin);