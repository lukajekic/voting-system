const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    members: {
        type: Array,
        required: true
    },

    admins: {
        type: Array,
        required: true
    }
}, {timestamps: true})

const model = mongoose.model('Group', schema)
module.exports = model