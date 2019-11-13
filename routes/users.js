var express = require('express');
var router = express.Router();

const Custom = require('../app/Controllers/customuser.controllers.js');
const Users = require('../app/Controllers/user.controllers.js');





// Retrieve all Users
router.post('/create', Users.User_create);
router.post('/login', Users.User_login);
router.get('/detail/:Id', Users.User_detail);

router.get('/fileupload', function(req, res) {
    res.render('index');
  });
  router.post('/fileupload', Custom.fileupload);
router.get('/customerlist', Custom.customlist);
router.get('/sendmail/:Id', Custom.sendmail);





module.exports = router;
