require('dotenv').config();
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

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://stirring-cocada-682cb6.netlify.app", 
    credentials: true,  
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],  // ✅ Added PATCH method
    allowedHeaders: ["Content-Type", "Authorization"],  
}));
app.use(cors({ origin: "*", credentials: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "https://stirring-cocada-682cb6.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});



  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  app.options('*', cors());

  

app.use("/api",router)

app.get("/",(req,res)=>{
    res.send("Hello World");
    return "hellow";
})


app.listen(port,()=>{
    const database= dbConncetion();
    if(!database) process.exit(1);
    console.log(`Server is running  ${port}`);
})





