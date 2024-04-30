const app = require('./backend/app');
const debug = require("debug")("pyq-node-angular");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const normalizePort = val => {
    var port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }

    if(port>=0){
        return port
    }

    return false
};

const onError = error => {
    if(error.svscall !== "listen"){
        throw error
    }

    const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
    switch(error.code){
        case "EACCES":
            console.log(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = ()=>{
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port "+ port;
    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set("port ",port);

const server = http.createServer(app);
// const io = socketIo(server);
// const io = require('socket.io')(server,{
//     cors:{
//         origin: '*',
//         methods: ['GET','POST']
//     }
// });

server.on("error ", onError);
server.on("Listening ", onListening);
server.listen(port);