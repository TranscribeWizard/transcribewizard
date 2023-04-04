const makeFileNameSafe = function (string) {
    return filenamify(string, {replacement: '_' }) // replace all non-URL-safe characters with an underscore
      .split('：').join(':') // replace chinese colon with english colon
      .replace(/[&\/\\#,+()$~%.'":*?<>{}!]/g, '') // remove special characters
      .replace(/\s+/g,'_') // replace spaces with underscores
  }

  
  module.exports = {
    makeFileNameSafe
  }