const mongoose = require('mongoose');
const db = ()=>{
    // Connecting to MongoDB
    mongoose.connect(`mongodb://localhost:27017/smartbot`,{useNewUrlParser:true,
    useUnifiedTopology:true}).then(()=>{
    console.log('* Database successfully connected * ');
    }).catch((e)=>{
    console.log(`_ Database not connected _`+e);
    })

}

module.exports.db = db;