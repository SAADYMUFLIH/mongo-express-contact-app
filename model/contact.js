const mongoose = require('mongoose');

//membuat Schema
const Contact = mongoose.model('Contact', {
    nama : {
        type: String,
        require: true
    },
    nohp : {
        type: String,
        require: true
    },
    email : {
        type: String,
    },
});

module.exports = Contact;