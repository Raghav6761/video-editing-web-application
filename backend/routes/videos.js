const express = require("express");
const multer = require("multer");
const fs = require("fs");
const socketIo = require("socket.io");

const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const ffmpegBinPath = path.join(__dirname, "../assets", "ffmpeg-7.0-full_build", "bin");
const ffmpegPath = path.join(ffmpegBinPath, "ffmpeg");
const ffmpegProbePath = path.join(ffmpegBinPath, "ffprobe");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffmpegProbePath);

const router = express.Router();

const MIME_TYPE_MAP = {
    'video/mp4': 'mp4',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        console.log('mime type of file', file.mimetype, file);
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        callback(null, "backend/videos"); //this is relative to the server.js file
    },
    filename: (req, file, cb) => {
        let name = file.originalname.toLowerCase().split(' ').join('-');
        name = name.split('.')[0];
        const ext = MIME_TYPE_MAP[file.mimetype];
        // cb(null, name + '-' + Date.now() + '.' + ext);
        cb(null, name + '.' + ext);
    }
});

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            // Handle error, such as logging or sending an error response
        } else {
            console.log('File deleted successfully:', filePath);
        }
    });
};

router.post("", multer({ storage: storage }).single("video"), (req, res, next) => {
    const videoPathTest = req.file.path;
    console.log('test path: ', videoPathTest)
    console.log('ffmpeg path and dir name : ', ffmpegPath, __dirname)

    const processVideoPath = path.join("backend/videos", "processed-" + req.file.originalname);
    // const processVideoPath = path.join("backend/videos", req.file.originalname);

    const url = req.protocol + "://" + req.get("host");
    const post = req.body;
    const videoPath = url + "/videos/" + req.file.filename
    const processedVideoPathReturn = url + "/videos/processed-" + req.file.filename;

    ffmpeg(videoPathTest)
        .withVideoCodec('libx264')
        // .outputOptions('-c:v libx264')
        .outputOptions('-crf 23')
        .outputOptions('-preset ultrafast')
        // .videoFilters('eq=brightness=0') //range is from -1 to 1 where 0 is the midpoint
        // .audioFilters('volume=2')
        // .noAudio()
        .save(processVideoPath)
        .on('end', () => {
            console.log('Processing Finished');
            res.status(201).json({
                message: 'video processed successfully',
                videoPath: videoPath,
                processedVideoPath: processedVideoPathReturn
            });
        })
        .on('error', (err) => {
            console.error('Error processing video', err);
            res.status(500).json({ error: 'Error Processing Video' })
        });

    console.log('req.body and req.file is here', req.body, req.file);
    // res.status(201).json({
    //     message: 'Video added Successfully',
    //     videoPath
    // });
});

router.post("/brightness", (req, res, next) => {
    console.log('adjust brightness accessed ', req.body);
    const videoPath = req.body.videoPath;
    const videoPathToWorkOnArr = videoPath.split("/")
    // console.log('video arr: ',videoPathToWorkOnArr)
    const videoPathToWorkOn = 'backend/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 2] + '/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 1]
    console.log('video path to work on: ', videoPathToWorkOn);
    const processedVideoPath = req.body.processedVideoPath;
    const processedVideoPathToWorkOnArr = processedVideoPath.split("/")
    // console.log('processedVideo arr: ',processedVideoPathToWorkOnArr)
    const processedVideoPathToWorkOn = 'backend/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 2] + '/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 1]
    console.log('processedVideo path to work on: ', processedVideoPathToWorkOn);
    const brightness = req.body.brightness;
    const volume = req.body.volume;
    // console.log('brightness', brightness);
    // console.log('eq=brightness='+ brightness);

    ffmpeg(videoPathToWorkOn)
        // .withVideoBitrate(480)
        .withVideoCodec('libx264')
        // .outputOptions('-c:v libx264')
        .outputOptions('-crf 23')
        .outputOptions('-preset ultrafast')
        .videoFilters('eq=brightness=' + brightness)
        // .videoFilters('eq=brightness=${brightness}')
        .audioFilters('volume=' + volume) // range from 0 to 2
        // .audioFilters('volume=2') // range from 0 to 2
        .save(processedVideoPathToWorkOn)
        .on('progress', (progress) => {
            io.emit('progress', progress);
            console.log('progress', progress);
        })
        .on('end', () => {
            console.log('Processing Finished');
            res.status(201).json({
                message: 'reaching here',
                videoPath: req.body.videoPath,
                processedVideoPath: req.body.processedVideoPath
            })
        })
        .on('error', (err) => {
            console.log('error', err)
            res.status(500).json({ error: 'Error in adjusting the brightness' })
        })
});

router.post("/volume", (req, res, next) => {
    console.log('adjust volume accessed ', req.body);
    const videoPath = req.body.videoPath;
    const videoPathToWorkOnArr = videoPath.split("/")
    // console.log('video arr: ',videoPathToWorkOnArr)
    const videoPathToWorkOn = 'backend/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 2] + '/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 1]
    console.log('video path to work on: ', videoPathToWorkOn);
    const processedVideoPath = req.body.processedVideoPath;
    const processedVideoPathToWorkOnArr = processedVideoPath.split("/")
    // console.log('processedVideo arr: ',processedVideoPathToWorkOnArr)
    const processedVideoPathToWorkOn = 'backend/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 2] + '/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 1]
    console.log('processedVideo path to work on: ', processedVideoPathToWorkOn);
    const brightness = req.body.brightness;
    const volume = req.body.volume;
    // console.log('volume', volume);
    // console.log('eq=volume='+ volume);

    ffmpeg(videoPathToWorkOn)
        .withVideoCodec('libx264')
        // .outputOptions('-c:v libx264')
        .outputOptions('-crf 23')
        .outputOptions('-preset ultrafast')
        .videoFilters('eq=brightness=' + brightness)
        // .audioFilters('volume='+volume) // range from 0 to 2
        .audioFilters('volume=' + volume) // range from 0 to 2
        .save(processedVideoPathToWorkOn)
        .on('end', () => {
            console.log('Processing Finished');
            res.status(201).json({
                message: 'reaching here',
                videoPath: req.body.videoPath,
                processedVideoPath: req.body.processedVideoPath
            })
        })
        .on('error', (err) => {
            console.log('error', err)
            res.status(500).json({ error: 'Error in adjusting the volume' })
        })
});

router.post("/combine", (req, res, next) => {

    console.log('combine videos and download accessed ', req.body);
    const videoPath = req.body.videoPath;
    const videoPathToWorkOnArr = videoPath.split("/")
    // console.log('video arr: ',videoPathToWorkOnArr)
    const videoPathToWorkOn = 'backend/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 2] + '/' + videoPathToWorkOnArr[videoPathToWorkOnArr.length - 1]
    console.log('video path to work on: ', videoPathToWorkOn);
    const processedVideoPath = req.body.processedVideoPath;
    const processedVideoPathToWorkOnArr = processedVideoPath.split("/")
    // console.log('processedVideo arr: ',processedVideoPathToWorkOnArr)
    const processedVideoPathToWorkOn = 'backend/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 2] + '/' + processedVideoPathToWorkOnArr[processedVideoPathToWorkOnArr.length - 1]
    console.log('processedVideo path to work on: ', processedVideoPathToWorkOn);
    // const volume = req.body.volume;
    // console.log('volume', volume);
    // console.log('eq=volume='+ volume);

    // ffmpeg(vidoPathToWorkOn)
    ffmpeg()
        // .audioFilters('volume='+volume) // range from 0 to 2
        // .audioFilters('volume=' + volume) // range from 0 to 2
        // .input("backend/assets/logo_video/pyq_logo_video.mp4")
        // .input(path.join(__dirname, "../assets", "logo_video","pyq_logo_video.mp4"))
        // .input(videoPathToWorkOn)
        .withVideoCodec('libx264')
        // .outputOptions('-c:v libx264')
        .outputOptions('-crf 23')
        .outputOptions('-preset ultrafast')
        .addInput(path.join(__dirname, "../assets", "logo_video", "pyq_logo_video.mp4"))
        .addInput(processedVideoPathToWorkOn) //since we need to download the altered file
        // .complexFilter([
        //     '[0:v] [0:a] [1:v] [1:a] concat=n=2:v=1:a=1 [v] [a]'
        // ])
        // .outputOptions('-c:v libx264 -preset veryfast -c:a aac -strict -2')
        // .complexFilter('[0:v] [0:a] [1:v] [1:a] concat=n=2:v=1:a=1 [v] [a] ')
        // .outputOptions('-c:v copy -c:a copy') // Copying streams without re-encoding
        // .complexFilter('[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]')
        // .outputOptions('-c:v libx264 -preset veryfast -c:a aac')
        // .output(processedVideoPathToWorkOn)
        .mergeToFile(videoPathToWorkOn) //reversing the usual order - this way we can overwrite the original file and return it without changing its name
        // .save(processedVideoPathToWorkOn)
        .on('end', () => {
            console.log('Combination Finished');
            res.status(201).json({
                message: 'reaching here',
                videoPath: req.body.videoPath,
                processedVideoPath: req.body.processedVideoPath
            })
            // deleteFile(processedVideoPath);
        })
        .on('error', (err) => {
            console.log('error', err)
            res.status(500).json({ error: 'Error in adjusting the combining the video' })
        })

});

module.exports = router;

// WebSocket connection handling
const server = require('http').Server(router);
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log('A client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});