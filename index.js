const express = require('express')
const multer = require('multer')

const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

const app = express()
const upload = multer()

let _model

app.post('/api', upload.single('image'), async (req, res) => {
  if (!req.file) res.status(400).send('Missing image multipart/form-data')
  else {
    const image = await tf.node.decodeImage(req.file.buffer)
    const predik = await _model.classify(image)
    image.dispose()
    const result = {}
	  for(let i of predik){
        result[i.className.toLowerCase()] = Math.ceil(i.probability * 100)
    }
    res.json(result)
  }
})

app.get('/', async (req, res) => {
    res.send('PornChecker API - From Gfriends Project');
})

const load_model = async () => {
    _model = await nsfw.load('file://./model/', { size: 224 })
}

load_model().then(() => app.listen(process.env.PORT || 5000))
