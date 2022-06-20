const mongoose = require('mongoose');
const schema = mongoose.Schema({
    titre : String,
    autonomie : String,
    permis : String,
    prix : Number,
    puissance : Number,
    equivalent : String,
    urlImage : String
})

module.exports = mongoose.model('emoto', schema);