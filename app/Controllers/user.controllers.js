
const UserService = require('../../services/user.services');


exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};


exports.User_create = async function (req, res) {
    try {
         var user=await UserService.saveUsers(req,res); 
         return res.status(200).json(user);
    }catch (e) {
        return res.status(422).json(e.message);
   }
};


exports.User_login =async function (req, res,next) {
    try {
        // console.log(req)
        var user_details=await UserService.login(req,res);
        if(user_details.status)
        return res.status(200).json(user_details);
        else
        return res.status(422).json(user_details);

   }catch (e) {
    throw Error(e.message);
   }
};






