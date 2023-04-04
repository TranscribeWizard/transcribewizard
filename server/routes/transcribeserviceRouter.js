const router = require('express').Router()
const { initiateTranscribingService, getTranscribedFile } = require('../controllers/transcribeserviceController')
const multer = require('multer')

const storage = multer.diskStorage({ // notice  you are calling the multer.diskStorage() method here, not multer()
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
  });
  
  let upload = multer({ storage });


router.post('/',upload.single('file'),initiateTranscribingService)

router.get('/:fileid',getTranscribedFile)

module.exports = router
