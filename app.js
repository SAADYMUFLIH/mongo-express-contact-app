const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//menjalankan koneksi database 
require('./utils/db');

const Contact = require('./model/contact');

const app = express();
const port = 3000;

//setup ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);//third-party middelware
app.use(express.static('public'));//built-in middelware 
app.use(express.urlencoded({ extended:true }));

//konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie : { maxAge: 6000 },
    secret : 'secret',
    resave : true,
    saveUninitialized: true,
}));
app.use(flash());

//halaman home 
app.get('/', (req, res) => {
    const mahasiswa = [
      {
        nama : 'Saady',
        email : 'saady@gmail.com'
      },
      {
        nama : 'Muflih',
        email : 'Muflih@gmail.com'
      },
      {
        nama : 'Uye',
        email : 'uye@gmail.com'
      },
    ];
    res.render('index', { 
      nama : 'Saady Muflih', 
      title: 'Halaman Home', 
      layout : 'layouts/main-layout',           
      mahasiswa,
    });
  });

  //halaman about
  app.get('/about', (req, res) => {
    res.render('about', {
      title : 'Halaman About',
      layout : 'layouts/main-layout'
    });
  });

  //halaman contact 
  app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();

    console.log(contacts);
    res.render('contact', {
      title : 'Halaman Contact',
      layout : 'layouts/main-layout',
      contacts,
      msg: req.flash('msg'),
    });
  });

  //halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    
    res.render('detail', {
      title : 'Halaman  Detail Contact',
      layout : 'layouts/main-layout',
      contact,
    });
  });

app.listen(port, () => {
    console.log(`Mongodb Contact App | listening at http://localhost:${port}`);
});