const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

const registerSchema = new Schema({
    first_name: {
        type :String,
        required : "Invaild first name",
        trim : true,
        min: 3
    },
    last_name: {
        type :String,
        required : "Invaild last name",
        trim : true,
        min: 3
    },
    email: {
        type :String,
        required : "Invaild email id",
        trim : true,
        unique:true,
        min: 6,
        index:true
    },
    password: {
        type :String,
        required : "Invaild password",
        trim : true,
        min: 6,
        max:50
    },
    mobile: {
        type :Number,
        required : "Invaild mobile number",
        trim : true,
        unique:true,
        index:true
    },
    is_active:{
        type : Number,
        default : 0
    },
    role_id:{
        type:Number,
        default:2
    },
    date:{
        type    :   Date,
        default :   Date.now
    },
    connected:{
        type : Boolean,
        default : true
    },
    mobile_verified:{
        type : Number,
        default:0
    },
    email_verified:{
        type:Number,
        default:0
    }
});

registerSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

registerSchema.methods.comparePassword = (password,hash) => {
    return bcrypt.compareSync(password,hash);
} 

const User = mongoose.model('User',registerSchema);

module.exports = User;
