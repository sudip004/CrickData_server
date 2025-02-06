require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { dbConncetion } = require('./db/db');
// User Router part
const router = require("./routes/UserRoutes");


const port =process.env.PORT || 3000;

app.use(
    cors({
      origin: `${process.env.FRONTEND_URL}`, 
      credentials: true, 
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  app.options('*', cors());

  

app.use("/api",router)




app.listen(port,()=>{
    const database= dbConncetion();
    if(!database) process.exit(1);
    console.log(`Server is running  ${port}`);
})