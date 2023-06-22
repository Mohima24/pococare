const jwt= require("jsonwebtoken")
require("dotenv").config()

const Authentication=(req,res,next)=>{

    let token = req.headers.authorization;

    if(!token){

        return res.send({status:"FAILED","messasg":"please log in"})
        
    }

    const decode= jwt.verify(token,process.env.userkey);

    if(!decode){

        return res.send({status:"FAILED","messasg":"please log in"})
        
    }else{

        const userID = decode.userID;
        const userRole = decode.userRole;
        req.body.userID=userID;
        req.body.userRole = userRole;
        next();
        
    }  
}

module.exports={
    Authentication
}