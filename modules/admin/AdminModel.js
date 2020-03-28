const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
    full_name: {
        type :String,
        required : "Invaild full name",
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
    is_active:{
        type : Number,
        default : 0
    },
    role_id:{
        type:Number,
        default:1
    },
    date:{
        type    :   Date,
        default :   Date.now
    },
    connected:{
        type : Boolean,
        default : true
    }
});

adminSchema.methods.hashpassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSalt(10));
}

adminSchema.methods.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password,hash);
}

const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;