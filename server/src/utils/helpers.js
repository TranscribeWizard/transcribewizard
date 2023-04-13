
const fs = require('fs-extra');


const l = console.log;
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 10000000000).toString();
}


const makeFileNameSafe = (string) => {
  return string
    .replace(/[^\w\s-]/g, '') // remove non-word characters (excluding spaces and hyphens)
    .replace(/\s+/g, '_') // replace spaces with underscores
    .replace(/--+/g, '_') // replace multiple hyphens with a single underscore
    .replace(/^-+|-+$/g, '') // trim hyphens from the beginning and end of the string
    .replace(/:/g, '_') // replace colons with underscores
    .replace(/_+/g, '_') // replace multiple underscores with a single underscore
    .toLowerCase(); // convert the string to lowercase
};
// Foremt std

  const ten = '94%|█████████▍| 13.0/13.7813125 [00:00<00:00, 17.19seconds/s]';
  
  function formatStdErr (stdErrData) {
    // if a progress output
    if (stdErrData.includes('seconds/s')) {
      // looks like: '█         '
      const progressBar = stdErrData.split('|')[1].split('|')[0]
  
      // looks like: '10%'
      let percentDone = stdErrData.split('|')[0].trim();
  
      // looks like: 10
      let percentDoneAsNumber = Number(stdErrData.split('%')[0].trim());
  
      // looks like: '00:10<01:25, 545.77frames/s]'
      let timeLeftPortion = stdErrData.split('[')[1].split('[')[0]
  
      // looks like: '00:10<01:25'
      const firstPortion = timeLeftPortion.split(',')[0]
  
      // looks like: '00:10'
      const timeElapsed = firstPortion.split('<')[0]
  
      // looks like: '01:25'
      const timeRemainingString = timeLeftPortion.split('<')[1].split(',')[0]
  
      // looks like: '545.77'
      const speed = timeLeftPortion.split('<')[1].split(',')[1].split('seconds')[0].trim()
  
      // looks like: '545.77'
      const splitTimeRemaining = timeRemainingString.split(':')
  
      // looks like: '01'
      const secondsRemaining = Number(splitTimeRemaining.pop());
  
      // looks like: '25'
      const minutesRemaining = Number(splitTimeRemaining.pop());
  
      // looks like: 'NaN'
      const hoursRemaining = Number(splitTimeRemaining.pop());
  
      // format for lib
      return {
        progressBar,
        percentDone,
        timeElapsed,
        speed,
        percentDoneAsNumber,
        timeRemaining: {
          string: timeRemainingString,
          hoursRemaining,
          minutesRemaining,
          secondsRemaining
        },
      }
    } else {
      return false
    }
  }

  const writeMetadata = (path, newData) => {
    // read existing data from file
    let existingData = {};
    try {
      const fileData = fs.readFileSync(path);
      existingData = JSON.parse(fileData);
    } catch (err) {
      console.error(`Error reading ${path}: ${err}`);
    }
  
    // merge existing and new data
    const mergedData = { ...existingData, ...newData };
  
    // write merged data to file
    try {
      fs.writeFileSync(path, JSON.stringify(mergedData, null, 2));
      console.log(`Successfully wrote metadata to ${path}`);
    } catch (err) {
      console.error(`Error writing metadata to ${path}: ${err}`);
    }
  };


  const wsSend = (socket, data) => {
    if(socket){

      if(socket.readyState || socket.readyState === 0) {
        socket.send(JSON.stringify(data));
      }else{
        console.log('socket not ready');
      }
    }
    else{
      console.log('socket closed i guess...');
    }
  }


  module.exports = {
    makeFileNameSafe,
    formatStdErr,
    generateRandomNumber,
    writeMetadata,
    wsSend
  }