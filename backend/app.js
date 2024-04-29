const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const videoRoutes = require("./routes/videos");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use("/videos", express.static(path.join("backend/videos")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/videos", videoRoutes);

module.exports = app;