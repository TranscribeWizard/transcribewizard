
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
        socket.send(JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }else{
        console.log('socket not ready');
      }
    }
    else{
      console.log('==== === == = socket closed i guess... = == === ====');
    }
  }


  module.exports = {
    makeFileNameSafe,
    generateRandomNumber,
    writeMetadata,
    wsSend
  }