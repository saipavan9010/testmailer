var express = require('express');
var router = express.Router();

const Custom = require('../app/Controllers/customuser.controllers.js');




// Retrieve all Users

router.post('/fileupload', Custom.fileupload);





module.exports = router;
