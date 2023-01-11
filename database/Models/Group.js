const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    groupId: {
        required: true,
        type: String
    },
    
    subscribers: {
        required: false,
        type: Array
    },

})
module.exports = mongoose.model("Group", groupSchema);