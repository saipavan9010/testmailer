var express = require('express');
var router = express.Router();

const Custom = require('../app/Controllers/customuser.controllers.js');




// Retrieve all Users

router.post('/fileupload', Custom.fileupload);
router.get('/customerlist', Custom.customlist);
router.get('/sendmail/:Id', Custom.sendmail);





module.exports = router;
