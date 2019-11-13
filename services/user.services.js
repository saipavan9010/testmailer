var User = require('../app/models/user.model');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

exports.saveUsers = async function (req,res,next) {

    try {
        let user =  new User(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                mobile_no: req.body.mobile_no,
                email: req.body.email,
                password: req.body.password,
            }
        );
      let user_data=await user.save();
        return  {status:"success", message: "user Created",data:{user: user_data}};
        
        
    } catch (e) {
        // Log Errors
        throw Error(e.message);
    }
}

exports.login = async function (req,res,next) {

    try {
        console.log(req.body.email);
        var user_data=await User.findOne({email:req.body.email});
        if(user_data && bcrypt.compareSync(req.body.password, user_data.password)) {
        const token =  jwt.sign({id: user_data._id}, req.app.get('secretKey'), { expiresIn: '12h' });
        
        return  {status:"success", message: "user found!!!",data:{user: user_data, token:token}};
        }else{
        return {message: "Invalid email/password!!!"};
        }
    } catch (e) {
        // Log Errors
        throw Error(e.message);
    }
}




