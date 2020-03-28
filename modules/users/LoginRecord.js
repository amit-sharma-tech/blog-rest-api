const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const loginRecordSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    ip_address :{
        type: String,
        trim : true,
    },
    login_token :{
        type: Object,
    },
    loginAt:{
        type    :   Date,
        default :   Date.now
    },
    logoutAt: {
        type: Date,
        default: null
    },
    publishedAt:{
        type: Date,
        default: null
    },
    is_active : {
        type: Number,
        default: 0
    }
});

const LoginRecords = mongoose.model('Login_record',loginRecordSchema);
module.exports = LoginRecords;