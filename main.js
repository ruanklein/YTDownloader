const { app }     = require('electron');

const MainWindow  = require('./electron/MainWindow');
const Event       = require('./electron/Event');

const event = new Event(app, new MainWindow);
if(event.handleStartUpEvent())
    return;

event.startAppEvents();
event.startWindowEvents();
event.startYouTubeEvents(`${app.getPath('appData')}/res/${process.platform==='win32'?'ffmpeg.exe':'ffmpeg'}`);