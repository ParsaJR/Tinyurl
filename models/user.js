const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        default: null
    },
    passowrd:{
        type: String,
        require: true,
        default: 0
    }
})

module.exports = mongoose.model('user',userSchema)
