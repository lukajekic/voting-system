const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    profilepicture: {
        type: String,
        required: false
    }
}, {timestamps: true})

const model = mongoose.model('User', schema)
module.exports = model