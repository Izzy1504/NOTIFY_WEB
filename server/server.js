const express = require('express');
const cors = require('cors');
const { exec } = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { execFile } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Update cache directory path to be inside server folder
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const fsAccess = promisify(fs.access);

app.get('/youtube-audio', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    console.log(`Request received for video ID: ${videoId}`);

    // Check if a cached file exists and is accessible
    const cachedFilePath = path.join(cacheDir, `${videoId}.mp3`);
    try {
      await fsAccess(cachedFilePath);
      console.log(`Cache hit for video ID: ${videoId}, serving from cache`);
      const stream = fs.createReadStream(cachedFilePath);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      stream.pipe(res);
      return;
    } catch (error) {
      // Cache miss, continue to download file
      console.log(`Cache miss for video ID: ${videoId}, downloading...`);
    }

    // Download audio using youtube-dl
    const outputTemplate = path.join(cacheDir, '%(id)s.%(ext)s');
    const youtubeDlOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputTemplate,
      audioQuality: '0', //best quality
      noCheckCertificates: true,
      ffmpegLocation: path.join(__dirname, 'ffmpeg', 'ffmpeg.exe')
    };

    const youtubeDlOutput = await exec(videoUrl, youtubeDlOptions);
    const match = youtubeDlOutput.match(/\[download\] Destination: (.*)/);
    let downloadedFilePath = null;

    if (match && match[1]) {
      downloadedFilePath = match[1];
    } else {
      throw new Error('Failed to download audio or get file path');
    }

    if (fs.existsSync(downloadedFilePath)) {
      const stream = fs.createReadStream(downloadedFilePath);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      stream.pipe(res);
      console.log(`Successfully downloaded and streamed video ID: ${videoId}`)
    } else {
      throw new Error('Downloaded audio file is missing')
    }

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).send(`Error processing audio for video ID: ${videoId}`);
  }
});

app.get('/cached-tracks', (req, res) => {
  fs.readdir(cacheDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading cache directory');
    }
    const tracks = files.map(file => {
      const [id] = file.split('.');
      return { id, path: path.join(cacheDir, file) };
    });
    res.json(tracks);
  });
});

// Add ffmpeg check function
async function checkFfmpeg() {
  const ffmpegPath = path.join(__dirname, 'ffmpeg', 'ffmpeg.exe');
  
  try {
    if (!fs.existsSync(ffmpegPath)) {
      throw new Error('ffmpeg.exe not found in ffmpeg folder');
    }

    await new Promise((resolve, reject) => {
      execFile(ffmpegPath, ['-version'], (error, stdout, stderr) => {
        if (error) {
          reject(`ffmpeg check failed: ${error.message}`);
        } else {
          console.log('ffmpeg is installed and working');
          console.log('ffmpeg version:', stdout.split('\n')[0]);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('ffmpeg check error:', error.message);
    process.exit(1); // Exit if ffmpeg is not working
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await checkFfmpeg();
  console.log(`Server running on port ${PORT}`);
});