// for getting duration and media size 

 // get upload duration
 const ffprobeResponse = await ffprobe(uploadedFilePath, { path: ffprobePath });

 const audioStream = ffprobeResponse.streams.filter(stream => stream.codec_type === 'audio')[0];
 const uploadDurationInSeconds = Math.round(audioStream.duration);

 const stats = await fs.promises.stat(uploadedFilePath);
 const fileSizeInBytes = stats.size;
 const fileSizeInMB = Number(fileSizeInBytes / 1048576).toFixed(1);

 // TODO: pull out into a function
 // error if on FS and over file size limit or duration limit
 const domainName = req.hostname;

 const isFreeSubtitles = domainName === 'freesubtitles.ai';
 if (isFreeSubtitles && !isYtdlp) {

   const amountOfSecondsInHour = 60 * 60;
   if (uploadDurationInSeconds > amountOfSecondsInHour) {
     const uploadLengthErrorMessage = `Your upload length is ${forHumansNoSeconds(uploadDurationInSeconds)}, but currently the maximum length allowed is only 1 hour`;
     return res.status(400).send(uploadLengthErrorMessage);
   }
   if (fileSizeInMB > uploadLimitInMB) {
     const uploadSizeErrorMessage = `Your upload size is ${fileSizeInMB} MB, but the maximum size currently allowed is ${uploadLimitInMB} MB.`;
     return res.status(400).send(uploadSizeErrorMessage);
   }
 }


// ===========================================================

// translatiions

//  In transcribe-wrapped on line 328