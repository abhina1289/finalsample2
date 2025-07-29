const mongoose = require('mongoose'); 

const connection_string=process.env.connection_string

mongoose.connect(connection_string).then((response)=>{
    console.log('Server connected with MongoDb-Atlas');

}).catch((error) =>{
    console.log("connection failed");
 console.log(error);
}) 
    
