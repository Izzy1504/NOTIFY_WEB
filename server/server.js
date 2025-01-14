const express = require('express');
const cors = require('cors');
const youtubeDl = require('youtube-dl-exec'); // Changed import
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { execFile } = require('child_process');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

// Create temp directory if not exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Update cache directory path to be inside server folder
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const fsAccess = promisify(fs.access);

// Google Drive API setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const credentials = require('./service-account.json');
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

// Get folder ID from Google Drive URL
const DRIVE_FOLDER_ID = '1LSnLQc1ihgrA4Fkw_1l7TmH7got1WIT9'; // Thay bằng ID folder thực tế của bạn

// Helper function to search file in Google Drive
async function findFileInDrive(videoId) {
  try {
    const response = await drive.files.list({
      q: `name = '${videoId}.mp3' and '${DRIVE_FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
    });
    return response.data.files[0];
  } catch (error) {
    console.error('Error searching file:', error);
    return null;
  }
}

// Helper function to get file's download URL
async function getDownloadUrl(fileId) {
  try {
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webContentLink'
    });
    return file.data.webContentLink;
  } catch (error) {
    console.error('Error getting download URL:', error);
    return null;
  }
}

// Helper function to upload file to Google Drive
async function uploadToDrive(filePath, fileName) {
  try {
    // Simple metadata without permissions
    const fileMetadata = {
      name: fileName,
      parents: [DRIVE_FOLDER_ID]
    };
    
    const media = {
      mimeType: 'audio/mpeg',
      body: fs.createReadStream(filePath)
    };
    
    // Create file with minimal fields request
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    const fileId = file.data.id;

    // Set public permission
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      },
      fields: 'id'
    });

    return fileId;
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
}

// Add yt-dlp path config
const YT_DLP_PATH = path.join(__dirname, 'yt-dlp.exe');

// Update youtube-dl options

const getYoutubeDlOptions = (tempFilePath) => ({
  extractAudio: true,
  audioFormat: 'mp3',
  output: tempFilePath,
  audioQuality: '0',
  noCheckCertificates: true,
  cookies: path.join(__dirname, 'cookies.txt'),
  ffmpegLocation: path.join(__dirname, 'ffmpeg', 'ffmpeg.exe'),
  forceIpv4: true,
  addHeader: [
    'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language:en-US,en;q=0.9',
    'sec-fetch-mode:navigate'
  ],
  sponsorblock: false,
  noWarnings: true,
  progress: true
});

// Helper function to check if file exists in cache
async function findFileInCache(videoId) {
  const cachedFilePath = path.join(cacheDir, `${videoId}.mp3`);
  try {
    await fsAccess(cachedFilePath, fs.constants.F_OK);
    return cachedFilePath;
  } catch (error) {
    return null;
  }
}

app.get('/youtube-audio', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    console.log(`Request received for video ID: ${videoId}`);

    // Add duration info to response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Audio-Status', 'loading');

    // Check if file exists in cache
    let cachedFilePath = await findFileInCache(videoId);
    if (cachedFilePath) {
      console.log(`File found in cache, streaming from cache: ${cachedFilePath}`);
      const stream = fs.createReadStream(cachedFilePath);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      stream.pipe(res);
      return;
    }

    // Check if file exists in Google Drive
    const driveFile = await findFileInDrive(videoId);
    if (driveFile) {
      console.log(`File found in Drive, streaming from Drive: ${driveFile.id}`);
      const driveResponse = await drive.files.get(
        { fileId: driveFile.id, alt: 'media' },
        { responseType: 'stream' }
      );
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      driveResponse.data.pipe(res);
      return;
    } else {
      console.log(`File not found in Drive for video ID: ${videoId}. Downloading and processing...`);
    }

    // Download and process new file
    const tempFilePath = path.join(tempDir, `${videoId}.mp3`);
    const options = getYoutubeDlOptions(tempFilePath);
    console.log('Downloading with options:', JSON.stringify(options, null, 2));
    
    try {
      await youtubeDl(videoUrl, options);
    } catch (dlError) {
      console.error('Download error:', dlError);
      // Retry with different options if error occurs
      const retryOptions = {
        ...options,
        addHeader: [
          ...options.addHeader,
          'Cookie: CONSENT=YES+1'
        ]
      };
      console.log('Retrying with options:', JSON.stringify(retryOptions, null, 2));
      await youtubeDl(videoUrl, retryOptions);
    }

    // After successful download, before streaming
    try {
      const mediaInfo = await youtubeDl(videoUrl, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true
      });
      
      res.setHeader('X-Audio-Duration', mediaInfo.duration);
      res.setHeader('X-Audio-Status', 'ready');
    } catch (error) {
      console.error('Error getting duration:', error);
    }

    // Upload to Google Drive with proper error handling
    let fileId;
    try {
      fileId = await uploadToDrive(tempFilePath, `${videoId}.mp3`);
      console.log(`File uploaded to Drive: ${fileId}`);
      
      // Get download URL after successful upload and permission set
      const downloadUrl = await getDownloadUrl(fileId);
      console.log(`File download URL: ${downloadUrl}`);
    } catch (uploadError) {
      console.error('Upload failed:', uploadError);
      // Continue with local file streaming even if upload fails
    }

    // Move temp file to cache directory
    cachedFilePath = path.join(cacheDir, `${videoId}.mp3`);
    fs.renameSync(tempFilePath, cachedFilePath);

    // Stream the file to client
    const stream = fs.createReadStream(cachedFilePath);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    stream.pipe(res);

  } catch (error) {
    console.error('Error details:', error.message);
    res.status(500).send(`Error processing audio: ${error.message}`);
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

app.get('/track-duration', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  try {
    const driveFile = await findFileInDrive(videoId);
    if (driveFile) {
      const fileId = driveFile.id;
      const file = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size'
      });

      const duration = await youtubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true
      });

      res.json({ duration: duration.duration });
    } else {
      res.status(404).send('File not found in Drive');
    }
  } catch (error) {
    console.error('Error getting track duration:', error);
    res.status(500).send('Error getting track duration');
  }
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