const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        console.log('mime type of file', file.mimetype);
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        callback(null, "backend/images"); //this is relative to the server.js file
    },
    filename: (req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer(storage).single("video") ,(req,res,next)=>{
    // console.log();
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added Successfully'
    });
});

router.get('', (req, res, next) => {
    const posts = [
        { id: 'fe2123fsd', title: 'some title', content: 'coming from the server .. .. ... . ...' },
        { id: 'fe2123fsd', title: 'some title 2', content: 'coming from the server .. .. ... . ... .' },
        { id: 'fe2123fs2', title: 'some title 3', content: 'coming from the server .. .. ... . ... .' },
        { id: 'fe2123fs3', title: 'some title 4', content: 'coming from the server .. .. ... . ... .' },
        { id: 'fe2123fs4', title: 'some title 5', content: 'coming from the server .. .. ... . ... .' },
        { id: 'fe2123fs5', title: 'some title 6', content: 'coming from the server .. .. ... . ... .' },
    ]
    res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: posts
    });
});

module.exports = router;