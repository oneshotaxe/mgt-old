const multer = require('multer')
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "static/templates");
  },
  filename: (req, file, cb) =>{
    let splitedFilename = file.originalname.split('.')
    let ext = splitedFilename[splitedFilename.length - 1]
    cb(null, req.params.name);
  }
});
var express = require('express')
var router = express.Router()

router.post('/:name', multer({storage:storageConfig}).single("template"), async (req, res) => {

  let filedata = req.file;
  if(!filedata)
    res.send("Ошибка при загрузке файла");
  else
    res.send("Файл загружен");
})

module.exports = router