require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { dbConncetion } = require('./db/db');
const http = require('http');
const { Server } = require('socket.io');

// ...your other requires
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});
// User Router part
const router = require("./routes/UserRoutes");


const port =process.env.PORT || 3000;

app.use(
    cors({
      origin: `${process.env.FRONTEND_URL}`, 
      credentials: true, 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      
    })
  );
  // app.use(cors({ origin: "*", credentials: true }));

  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  app.options('*', cors());

  

app.use("/api",router)

app.get("/",(req,res)=>{
    res.send("Hello World");
    return "hellow";
})



//--------------------------------------------------------------------------------------------------------
// Socket.IO signaling logic
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join-stream', ({ streamId }) => {
    socket.join(streamId);
    socket.to(streamId).emit('user-joined', socket.id);
  });

  socket.on('offer', ({ offer, to }) => {
    io.to(to).emit('receive-offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ answer, to }) => {
    io.to(to).emit('receive-answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

//----------------------------------------------------------------------------------------------------


server.listen(port,()=>{
    const database= dbConncetion();
    if(!database) process.exit(1);
    console.log(`Server is running  ${port}`);
})





