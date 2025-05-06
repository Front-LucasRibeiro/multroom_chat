const path = require('path');
const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
require('./database');

var app = express();

// Configurações de views
app.set('view engine', 'ejs');
app.set('views', 'app/views');

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.static('app/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Autoload de rotas, modelos e controladores
consign()
  .include('app/routes')
  .then('app/controllers')
  .into(app);

module.exports = app;