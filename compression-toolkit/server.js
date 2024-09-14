const express = require('express');
const multer = require('multer');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/compress', upload.array('files'), async (req, res) => {
  const compressionLevel = req.body.compressionLevel;
  const files = req.files;
  const promises = files.map(async (file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {

      await imagemin([file.path], {
        destination: 'compressed/',
        plugins: [
          imageminMozjpeg({ quality: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 70 : 90 }),
          imageminPngquant({ quality: [compressionLevel === 'high' ? 0.5 : 0.7, 0.8] })
        ]
      });
    } else if (ext === '.mp4' || ext === '.avi' || ext === '.mov') {
      
      const outputFilePath = `compressed/${file.originalname}`;
      await new Promise((resolve, reject) => {
        ffmpeg(file.path)
          .output(outputFilePath)
          .videoCodec('libx264')
          .size(compressionLevel === 'high' ? '320x240' : compressionLevel === 'medium' ? '640x480' : '1280x720')
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
    }
  });

  await Promise.all(promises);
  res.json({ message: 'Files compressed successfully!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
