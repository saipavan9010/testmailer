
var Author = require('../models/custom_user.model');
var csv = require('fast-csv');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');

exports.fileupload = async function (req, res) {
    //console.log(req.files);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
    var authors = [];
   await csv.fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['first_name'] =data.firstname;
         data['last_name'] =data.lastname;
         data['mobile_no'] =data.phone;
         data['email'] =data.email;
         data['address'] =data.address;
         data['gender']=data.gender;
          
         authors.push(data);
     })
     .on("end", function(){
         Author.create(authors, function(err, documents) {
            if (err) throw err;
         });
         res.redirect('/tablelist');
          
     });
};

exports.customlist = async function (req, res) {
  var page = parseInt(req.query.page)
  var size = parseInt(req.query.length)
  var query = {}
  var search_query={};
  var sort={};
  var ord_dir=-1;
  if(req.query.search_text){
    search_query= { $or: [{ 'mobile_no': { $regex:  req.query.search_text, $options: 'i'} }, { 'email': { $regex:  req.query.search_text, $options: 'i'} },{ 'first_name': { $regex:  req.query.search_text, $options: 'i'} },{ 'last_name': { $regex:  req.query.search_text, $options: 'i'} }] };
  }
  if(req.query.order_by){
      if(req.query.order_direction=='asc')
         ord_dir=1;
      sort={[req.query.order_by]:ord_dir};
  }
  if(page < 0 || page === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (page - 1)
  query.limit = size
  query.sort=sort
 await  Author.count(search_query,function(err,totalCount) {
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"}
    }
     Author.find(search_query,{},query,function(err,data) {
            // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"responseData" : data,"pages": totalCount};
        }
        res.json(response);
    });
 })
    
};

exports.sendmail=async function (req, res,next) {
    try{
        var user_data=await Author.findById(req.params.Id);
        console.log(user_data);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user:"saipavan9010@gmail.com", 
                pass: "darlingpavan1" 
            },tls: {rejectUnauthorized: false}
        });
    // send mail with defined transport object
        let info =  transporter.sendMail({
            from: 'saipavan9010@gmail.com', // sender address
            to:"saipavan4739@gmail.com",
            subject: 'Hello ✔', // Subject line
            html: `<b>Hey `+user_data.first_name+`</b><br>
                    NAME:`+user_data.first_name+` `+user_data.last_name+`<br>
                    Email:`+user_data.email+`<br>
                    Phone:`+user_data.mobile_no+`<br>
                    Address:`+user_data.address+`<br>
                    Gender:`+user_data.gender+`<br>`

        });
    
        console.log('Message sent: %s', info.messageId);
        return res.status(200).send(info.messageId);

    }catch (e) {
        // Log Errors
        throw Error(e.message);
    }
    
 };











    
   








