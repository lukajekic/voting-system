const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Group'
    },

    options: [
  {
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
  }
],

    voted: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    }
}, {timestamps: true})

const model = mongoose.model('Voting', schema)
module.exports = model