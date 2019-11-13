var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login');
});

router.get('/singup', function(req, res) {
  res.render('singup');
});

router.get('/tablelist', function(req, res) {
  res.render('table');
});

module.exports = router; 
