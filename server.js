const path = require('path');
const http = require('http');
const express = require('express');
const req = require('express/lib/request');
const socketio = require('socket.io');
const formatmessage = require('./utils/message')
const { userjoin, getcurrentuser, userleave, getroomusers } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));
const botname = 'UChat bot'

//run hen client connect
io.on('connection', socket =>{

   socket.on('joinroom',({username, room}) => {

          const user = userjoin(socket.id, username, room);
         socket.join(user.room);
          //welcome current user
    socket.emit('message',formatmessage(botname,'welcome to UChat'));

    // broadcast when user5 connect
    socket.broadcast.to(user.room).emit('message',formatmessage(botname, ` ${user.username} has joined the chat`));
     
   //send user room info
   io.to(user.room).emit('roomusers',{
     room: user.room,
     users: getroomusers(user.room)
   });

   });

    
    
   // listen for chatmsg
    socket.on('chatmessage', (msg) =>{
        const user = getcurrentuser(socket.id);
        io.to(user.room).emit('message',formatmessage(`${user.username}`,msg));
    });

     // run hen client disconnect
     socket.on('disconnect', () => {
       const user = userleave(socket.id);

       if(user){
        io.to(user.room).emit('message',formatmessage(botname,`${user.username} has left the chat`));
       
        //send user room info
   io.to(user.room).emit('roomusers',{
    room: user.room,
    users: getroomusers(user.room)
  });

       }
      });
    
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>{console.log(`server is running on port ${PORT}`)});
