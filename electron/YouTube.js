const ytdl   = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffbin  = require('ffmpeg-static-electron');
const fs     = require('fs');

class YouTube {
    constructor(event, data) {
        this.data = data;
        this.event = event;
    }

    getInfo() {
        const { url } = this.data;
        ytdl.getBasicInfo(url, (err, info) => {

            const fmtTime = s => (s-(s %= 60)) / 60 + (9 < s ? ':' : ':0' ) + s;
         
            let data = {
                error: true,
                info: {}
            };
         
            if(err) {
                this.event.sender.send('YouTube:Info:Data', data);
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
         
             this.event.sender.send('YouTube:Info:Data', data);
        });
    }

    run() {
        const { audioFile, videoFile, url, index, format, ffmpegBin } = this.data;
        const command = ffmpeg().setFfmpegPath(ffbin.path);

        let message = 'Downloading Video';

        if(format === 'mp4') {
            ytdl(url, { filter: ({ container, encoding }) => container === 'm4a' && !encoding })
                .on('progress', (chunkLength, downloaded, total) => {
                    const percentage = downloaded / total;
                    this.event.sender.send('YouTube:Download:Progress', 
                        index, (percentage*100).toFixed(0), message);
                })
                .on('error', err => {
                    this.event.sender.send('Error', index, err);
                })
                .on('finish', () => {
                    this.event.sender.send('Converting:Toggle', index);
                    command
                        .input(ytdl(url, { 
                            filter: ({ container }) => container === 'mp4',
                            quality: 'highestvideo'
                        }).on('error', err => {
                            this.event.sender.send('Converting:Toggle', index); 
                            this.event.sender.send('Error', index, err); 
                        }))
                        .on('progress', progress => {
                            message = `Converting to MP4 (${progress.timemark})`;
                            this.event.sender.send('YouTube:Download:Progress', index, 100, message);
                        })
                        .on('error', err => { 
                            this.event.sender.send('Converting:Toggle', index);
                            this.event.sender.send('Error', index, err);
                        })
                        .on('end', () => {
                            fs.unlink(audioFile, err => {
                                this.event.sender.send('Converting:Toggle', index);
                                if (err) {
                                    this.event.sender.send('Error', index, err);
                                    return;
                                }

                                this.event.sender.send('YouTube:Download:Finish', index);
                            });
                        })
                        .videoCodec('copy')
                        .input(audioFile)
                        .audioCodec('copy')
                        .save(videoFile);
                        
                })
                .pipe(fs.createWriteStream(audioFile));
        }
        else {
            this.event.sender.send('Converting:Toggle', index);
            command
                .input(ytdl(url, 
                    { quality: 'highestaudio' }
                ).on('error', err => {
                    this.event.sender.send('Converting:Toggle', index);
                    this.event.sender.send('Error', index, err);
                }))
                .on('progress', p => {
                    message = `Converting to MP3 (${p.targetSize}kb downloaded)`;
                    this.event.sender.send('YouTube:Download:Progress', index, 100, message);
                })
                .on('error', err => {
                    this.event.sender.send('Converting:Toggle', index);
                    this.event.sender.send('Error', index, err)
                })
                .on('end', () => {
                    this.event.sender.send('Converting:Toggle', index);
                    this.event.sender.send('YouTube:Download:Finish', index);
                })
                .audioBitrate(320)
                .save(audioFile);
        }
    }
}

module.exports = YouTube;