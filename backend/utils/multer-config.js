import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "./public/temp")
  },
  filename: function(req, file, cb){
    const suffix = Date.now()
    cb(null, suffix + "-" + file.originalname)
  }
});
  

const upload = multer({storage});

export default upload;