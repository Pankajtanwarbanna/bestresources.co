const express       = require('express');
const app           = express();
const morgan        = require('morgan');
const validator     = require('express-validator');
const bodyParser    = require('body-parser')

const constant      = require(__basePath + 'app/config/constant.js');

app.use(morgan('dev'));
app.use(validator({}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require(constant.path.app + 'core/routes')(app); // API Routes

app.use(express.static(constant.path.base + '/public'));

// index page
app.get('*', function (req,res) {
  res.sendFile(constant.path.base + '/public/app/views/index.html');
});

/*
 * catch 404
 */
app.use(function (req, res) {
  return res.status(400).json({
      status : false,
      message: 'Oops! 404 - Page Not found'
  });
});

module.exports = app;