const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    views : {
        type : Number,
        default : 0
    },
    ownerId : {
        type : String,
    },
    ownerName : {
        type : String,
    }
})

module.exports = mongoose.model('videoModel',videoSchema)