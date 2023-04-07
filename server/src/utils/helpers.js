const l = console.log;

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 10000000000).toString();
}


const makeFileNameSafe =  (string) => {
    return filenamify(string, {replacement: '_' }) // replace all non-URL-safe characters with an underscore
      .split('：').join(':') // replace chinese colon with english colon
      .replace(/[&\/\\#,+()$~%.'":*?<>{}!]/g, '') // remove special characters
      .replace(/\s+/g,'_') // replace spaces with underscores
  }

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


  module.exports = {
    makeFileNameSafe,
    formatStdErr,
    generateRandomNumber
  }