var express = require('express');
const {createReadStream} = require("fs");
var router = express.Router();
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/301', function (req, res, next) {
  return res.redirect(301, '/ressource/text')
});
router.all('/error/:error', function (req, res, next) {
  let method = req.method
  let error = req.params.error
  res.setHeader('x-method', method)
  res.setHeader('x-status', error)
  return res.status(error).send(`Erreur ${error}`)
});

router.all('/ressource/:ressource', async (req, res) => {
  let method = req.method
  let ressource = req.params.ressource
  res.setHeader('x-method', method)
  res.setHeader('x-ressource', ressource)
  res.setHeader('x-body', req.body)
  switch (true) {
    case ressource === "text":
      return res.send(`Text generated on ${dayjs().format('DD/MM/YYYY à HH:mm:ss')}`)
    case ressource === "json":
      return res.send({
        firstname: "John",
        lastname: "Snow",
        desc: "Know nothing"
      })
    case ressource === "blob":
      res.setHeader('Content-Type', 'image/png')
      return res.sendFile(path.join(__dirname, '../public', 'images/image.png'))
    case ressource === "image":
      res.setHeader('Content-Type', 'image/png')
      return res.sendFile(path.join(__dirname, '../public', 'images/image.png'))
    case ressource === "video":
      res.setHeader('Content-Type', 'video/mp4')
      return res.sendFile(path.join(__dirname, '../public', 'videos/video.mp4'))
    case ressource === "audio":
      res.setHeader('Content-Type', 'audio/mp3')
      return res.sendFile(path.join(__dirname, '../public', 'audios/audio.mp3'))
    case ressource === "buffer":
      res.setHeader('Content-Type', 'application/octet-stream')

      let stream = await new Promise((resolve, reject) => {
        let readStream = createReadStream('./public/videos/video.mp4');
        readStream.on('error', (e) => {
          reject(e)
        });
        readStream.on('end', () => {
          resolve(readStream)
        });
      })
      return res.send(stream.buffer)
  }
})

module.exports = router;
