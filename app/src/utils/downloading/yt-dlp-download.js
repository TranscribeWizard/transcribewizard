const l = console.log
const spawn = require('child_process').spawn
function extractDataFromString (string) {
    const percentDownloaded = parseInt(string.match(/(\d+\.?\d*)%/)[1]);
    const totalFileSize = string.match(/of\s+(.*?)\s+at/)[1];
    const downloadSpeed = string.match(/at\s+(.*?)\s+ETA/)[1];
  
    const fileSizeValue = totalFileSize.match(/\d+\.\d+/)[0];
    const fileSizeUnit = totalFileSize.split(fileSizeValue)[1];
  
    return {
      percentDownloaded,
      totalFileSize,
      downloadSpeed,
      fileSizeUnit,
      fileSizeValue,
    }
  }


async function downloadFileApi ({
    videoUrl,
    numberToUse,
    filepath,
    randomNumber,
    filename,
}) {
    return new Promise(async (resolve, reject) => {
        try{
            let latestDownloadInfo = '';
            let currentPercentDownload = 0;

            const startedAtTime = new Date();

            const interval = setInterval(() => {
                l(latestDownloadInfo);
                        // only run if ETA is in the string
        if (!latestDownloadInfo.includes('ETA')) return

        const { percentDownloaded, totalFileSize, downloadSpeed, fileSizeUnit, fileSizeValue } = extractDataFromString(latestDownloadInfo);
        currentPercentDownload = percentDownloaded;

            },1000);

            const ytdlProcess = spawn('yt-dlp', [
                videoUrl,
                '--no-mtime',
                '--no-playlist',
                '-f',
                'bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                '-o',
                `./uploads/${numberToUse}`
              ]);

              ytdlProcess.stdout.on('data', (data) => {
                l(`STDOUT: ${data}`);
                latestDownloadInfo = data.toString();
              })
        
              ytdlProcess.stderr.on('data', (data) => {
                l(`STDERR: ${data}`);
              });
        
              ytdlProcess.on('close', (code) => {
                l(`child process exited with code ${code}`);
                clearInterval(interval)
                if (code === 0) {
                  resolve();
                } else {
                  reject();
                }
              });
        }
        catch(err){
            l(`error from download: `,err);
            reject(err);
            throw new Error(err,400)
        }
    })
}

// get file title name given youtube url
async function getFilename (videoUrl) {
    return new Promise(async (resolve, reject) => {
        l('get filename')
      try {
  
        const ytdlProcess = spawn('yt-dlp', [
          '--get-filename',
          '-f',
          'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
          videoUrl
        ]);
  
        ytdlProcess.stdout.on('data', (data) => {
          l(`STDOUTT: ${data}`);
          resolve(data.toString().replace(/\r?\n|\r/g, ''));
        })
  
        ytdlProcess.stderr.on('data', (data) => {
          l(`STDERR: ${data}`);
        });
  
        ytdlProcess.on('close', (code) => {
          l(`child process exited with code ${code}`);
          if (code === 0) {
            resolve();
          } else {
            reject();
          }
        });
  
      } catch (err) {
        l('error from download')
        l(err);
  
        reject(err);
  
        throw new Error(err)
      }
  
    });
  
  }



module.exports = {
    downloadFileApi,
    getFilename
  };
  