const jwt = require("jsonwebtoken");


const authenticate = (req, res, next) => {
     const token = req.cookies?.token;
   console.log("auth token",token);
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        req.user = decoded;
          console.log("req,user",req.user);
        next();
    } catch (error) {
        console.log("authuserammmmiiii",error);
        
        res.status(400).send('Invalid token');
    }
}

module.exports = { authenticate };
