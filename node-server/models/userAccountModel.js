const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    videos : {
        type : [String],
        default : null
    },
    description : {
        type : String,
        default : null
    }
});

module.exports = mongoose.model('user',userSchema);