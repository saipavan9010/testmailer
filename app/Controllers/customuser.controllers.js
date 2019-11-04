
var Author = require('../models/custom_user.model');


var csv = require('fast-csv');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require("node-cron");





exports.fileupload = async function (req, res) {
    //console.log(req.files);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
    var authors = [];
   await csv
     .fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         console.log(data);
         
         data['first_name'] =data.firstname;
         data['last_name'] =data.lastname;
         data['mobile_no'] =data.phone;
         data['email'] =data.email;
         data['address'] =data.address;
         data['gender']=data.address;
          
         authors.push(data);
     })
     .on("end", function(){
         Author.create(authors, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(authors.length + ' authors have been successfully uploaded.');
     });
};

cron.schedule("* * * * *", function() {
    sendmailbcc();
    sendmail();
});

cron.schedule("55 11 * * *", function() {
    Updatemail();
});


async function sendmailbcc(){
    try {
        var user_data=await Author.find().select('email').where({'status':0}).limit(300);
        var Bcc_data=[];
        for(var i=0;i<user_data.length;i++){
            console.log(user_data[i].email);
            console.log(i);
            await Author.findByIdAndUpdate(user_data[i]._id,{$set:{status:1}});
            Bcc_data.push(user_data[i].email);
            console.log(Bcc_data);
        }
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user:"Usermail@mail.com", 
                    pass: "123456" 
                },tls: {rejectUnauthorized: false}
            });
        // send mail with defined transport object
            let info =  transporter.sendMail({
                from: 'saipavan9010@gmail.com', // sender address
                Bcc_data:Bcc_data,
                subject: 'Hello ✔', // Subject line
                html: `<b>Hey `+user_data[i].first_name+`</b><br>
                        NAME:`+user_data[i].first_name+` `+user_data[i].last_name+`<br>
                        Email:`+user_data[i].email+`<br>
                        Phone:`+user_data[i].mobile_no+`<br>
                        Address:`+user_data[i].address+`<br>
                        Gender:`+user_data[i].gender+`<br>`

            });
        
            console.log('Message sent: %s', info.messageId);
            return res.status(200).send(info.messageId);
            
        
        
       }catch (e) {
        console.log(e.message);
        //throw Error(e.message);
    }  
}

async function sendmail(){
    try {
        var user_data=await Author.find().where({'status':0}).limit(100);
        console.log(user_data);
        for(var i=0;i<user_data.length;i++){
            console.log(user_data[i].email);
            console.log(i);
            await Author.findByIdAndUpdate(user_data[i]._id,{$set:{status:1}})
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user:"Usermail@mail.com", 
                    pass: "123456" 
                },tls: {rejectUnauthorized: false}
            });
        // send mail with defined transport object
            let info =  transporter.sendMail({
                from: 'saipavan9010@gmail.com', // sender address
                to:user_data[i].email , // list of receivers
                subject: 'Hello ✔', // Subject line
                html: `<b>Hey `+user_data[i].first_name+`</b><br>
                        NAME:`+user_data[i].first_name+` `+user_data[i].last_name+`<br>
                        Email:`+user_data[i].email+`<br>
                        Phone:`+user_data[i].mobile_no+`<br>
                        Address:`+user_data[i].address+`<br>
                        Gender:`+user_data[i].gender+`<br>`

            });
        
            console.log('Message sent: %s', info.messageId);
            return res.status(200).send(info.messageId);
        }    
        
        
       }catch (e) {
        console.log(e.message);
        //throw Error(e.message);
    }  
}
    
    async function Updatemail(){
        try {
            var user_update_data=await Author.updateMany({$set:{status:0}});
          }catch (e) {
            console.log(e.message);
       }
    }   








