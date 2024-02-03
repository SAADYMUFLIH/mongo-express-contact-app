const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/belajar', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


// //menambah 1 Data
// const contact1 = new Contact({
//     nama: 'ripal',
//     nohp: '087749408905',
//     email: 'ripal@gmail.com',
// });

// //simpan kedalam collection 
// contact1.save().then((contact) => console.log(contact));