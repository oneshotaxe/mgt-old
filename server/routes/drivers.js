const multer = require('multer')
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "static/img");
  },
  filename: (req, file, cb) =>{
    let splitedFilename = file.originalname.split('.')
    let ext = splitedFilename[splitedFilename.length - 1]
    cb(null, req.params.id + '.' + ext);
  }
});

const api = require('./_api')
const Model = require('../models').Driver

let router = api(Model)

router.post('/set_image/:id', multer({storage:storageConfig}).single("avatar"), async (req, res) => {

  let filedata = req.file;
  if(!filedata)
    res.send("Ошибка при загрузке файла");
  else
    var model = await Model.findById(req.params.id).exec();
    let image = '/img/' + filedata.filename 
    model.set({ image })
    await model.save()
    res.send(image);
})

router.post('/remove_image/:id', async (req, res) => {
  var model = await Model.findById(req.params.id).exec();
  model.set({ image: '' })
  await model.save()
  res.send("Ok");
})

module.exports = router