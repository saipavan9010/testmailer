const mongoose = require('mongoose');
const CustomUserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    mobile_no:String,
    email:String,
    gender: String,
    address: String,
    status:{type:Number,default:0}
    
}, {
    timestamps: true
});



module.exports = mongoose.model('Customsers', CustomUserSchema);