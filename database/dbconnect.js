const mongoose = require('mongoose');
const db = ()=>{
    // Connecting to MongoDB
    mongoose
      .connect(
        "mongodb+srv://sammuthembwa926:oNPRkrnSagkliSgy@smatbot-cluster.nualulv.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then(() => {
        console.log("* Database successfully connected * ");
      })
      .catch((e) => {
        console.log(`_ Database not connected _` + e);
      });

}

module.exports.db = db;