const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken= (req, res, next)=>{
  const token = req.headers.authorization
  if(token){
      try{
          const decoded = jwt.verify(token.split(' ')[1],process.env.SECRET)
          if(decoded){
            console.log(decoded)
            req.body.userId = decoded.userId
            // req.body.role = decoded.role
            // console.log(req.body.userId)
              next()
          }else{
              res.send({'msg':'Please Login!'})
          }
      }catch(err){
          res.send({error: "Invalid Token"})
      }
  }else{
      res.send('Please Login!')
  }
}
module.exports = { authenticateToken };
