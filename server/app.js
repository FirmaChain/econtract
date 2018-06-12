const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const genUUID = require("uuid")

const RoomMgr = require('./RoomMgr')
const UserMgr = require("./UserMgr")
const sqlFunc = require("./sql");

let app = express();
let server = http.Server(app);

let io = socketio(server);
let userMgr = new UserMgr(io,app);
let roomMgr = new RoomMgr(io,app);

io.on('connection', async(socket) => {
  function wrapped(sock){
    sock._on = sock.on
    sock._emit = sock.emit

    sock.on = function(msg,func){
      sock._on(msg,async function(data,ack){
        let ret = await func(data)
        ack && ack(ret)
      })
    }

    sock.emit = function(msg,data){
      return new Promise((r)=>{
        sock._emit(msg,data,r)
      })
    }
    return sock
  }
  socket = wrapped(socket)

  let user = null
  let token = await socket.emit("handshake:get:token")
  if(token !== null){
    user = await sqlFunc.tokenValidate(token);
  }

  if(user == null){
    token = await sqlFunc.newUser(genUUID());
  }

  if(await socket.emit("handshake:set:token",token)){
    userMgr.registEvent(token,socket)
    roomMgr.registEvent(token,socket)

    socket.emit("handshake:fin")
  }
});

app.get('/', (req, res) => {
  res.send('');
});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});