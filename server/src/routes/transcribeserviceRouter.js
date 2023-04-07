const router = require('express').Router()
const { initiateTranscribingService, getTranscribedFile } = require('../controllers/transcribeserviceController')
const multer = require('multer')

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
      cb(null, 'media/uploads')
    },
  });
  
  let upload = multer({ storage });


router.post('/',upload.single('file'),initiateTranscribingService)

router.get('/:fileid',getTranscribedFile)

module.exports = router
