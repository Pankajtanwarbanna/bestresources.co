const app           = require('express')();
const morgan        = require('morgan');
const validator     = require('express-validator');
const bodyParser    = require('body-parser')

const constant      = require(__basePath + 'app/core/constant.js');

app.use(morgan('dev'));
app.use(validator({}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require(constant.path.app + 'core/routes')(app); // API Routes

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