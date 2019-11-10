var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/tablelist', function(req, res) {
  res.render('table');
});

module.exports = router; 
