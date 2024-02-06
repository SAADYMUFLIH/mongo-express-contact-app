const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check, Result } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


//menjalankan koneksi database 
require('./utils/db');

const Contact = require('./model/contact');

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride('_method'));

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

  //halaman form tambah data contact
  app.get('/contact/add' , (req , res) => {
    res.render('add-contact', {
      title : 'Form Add Data Contact',
      layout : 'layouts/main-layout',
    });
  });

  //proses tambah data contact
  app.post('/contact', [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if(duplikat){
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email','Email tidak valid!').isEmail(),
    check('noHp','No Hp tidak valid!').isMobilePhone('id-ID'),
  ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // return res.status(400).json({ errors:errors.array() });
      res.render('add-contact', {
        title :'Form Add Data Contact',
        layout :'layouts/main-layout',
        errors: errors.array(), 
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        //kirimkan flash message
        req.flash('msg', 'Data contact berhasil ditambah!')
        res.redirect('/contact');
      });
    }
  });

  //proses delete contact
  app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
      req.flash('msg', 'Data contact berhasil dihapus!')
      res.redirect('/contact');
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