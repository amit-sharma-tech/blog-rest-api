const User = require('./UserModel');
const {resp} = require('../../helpers/ResponseHelper');
const jwt  = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const LoginRecords = require('./LoginRecord');
var md5 = require('md5');
require('dotenv').config();

signToken = user =>{
    return jwt.sign(
        {
            userId: user.id,
            iat : new Date().getTime(), //current time
            exp : new Date().setDate(new Date().getDate() + 1) //current time +1 day
        }, process.env.TOKEN_SECRET,
        /* {
            expiresIn : "1h"
        } */
    );
}

initToken =  (user,ip) => 
{
    var ciphertext = CryptoJS.AES.encrypt(user.id+md5(ip+'BLOG'+user.id+'BLOG'), process.env.SALT).toString();
    return ciphertext
}
check_token_created = (user,token) => {
    /* var loginToken = await LoginRecord.findOne({$and:[
            {login_token:token},
            {user_id:user.id},
            {is_active:1},
            {"loginAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}}
        ]},
        {user_id: 1,_id:0}
    );
    if(!loginToken){
        return 1;
    }
    else{
        return 0;
    } */
}

module.exports = {
    signUp : async(req, res, next) => {
        const data = req.value.body;
        const emailExist = await User.findOne({email:data.email});
        if(emailExist)
        {
            res.statusCode = 400;
            res.send(resp('ERR',"User already exist",''));
        } 
        else{
            const records = new User();
            const newUser = new User({
                first_name: data.last_name,
                last_name: data.last_name,
                email: data.email,
                mobile: data.mobile,
                password: await records.hashPassword(data.password),
            });
            var saveUser =  await newUser.save();
            res.statusCode = 200;
            res.send(resp('SUC',"Successfully Register",''));
        }
    },
    signIn: async(req, res, next) =>{
        var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        const token = initToken(req.user,ip);
        // const check_token  = check_token_created(user,token);
        const login_data = new LoginRecords({
            user_id     : req.user.id,
            login_token :   token,
            is_active   :   1
        });
        await login_data.save();
        res.statusCode = 200;
        res.send(resp('SUC',"Login Success",token));
    },
    secret : async (req, res, next) =>{
        res.statusCode = 200;
        res.send(resp('SUC',"Succesfully secret",''));
    },
    
    /* activate_user : async(re,res,next) => {
        const data = req.value.body;
        const emailExist = await User.findOne({email:data.email});
        if(emailExist)
        {   
            await User.updateOne({_id:req.user._id},{$set:{is_active:data.is_active}});
            res.status(200).json({
                statuscode: resp('SUC'),
                message:'Updated successfully',
                data : emailExist.is_active
            });
        } 
        else{
            return res.status(400).json(resp('ERR', 'User is not found'));
        }
    }, */

    updateRole : async(req,res,next) => {
        const data = req.value.body;
        const emailExist = await User.findOne({email:data.email});
        if(emailExist)
        {
            await User.updateOne({_id:req.user._id},{$set:{role_id:data.role_id}});
            res.statusCode = 200;
            res.send(resp('SUC',"User role has updated successfully",''));
        } 
        else{
            res.statusCode = 400;
            res.send(resp('ERR',"User is not found",''));
        }
    },
    logout : async(req, res, next) => {
        console.log(req.user_data,'request data remove');
        await User.updateOne({_id:req.user_data.id},{$set :{connected : false}});
        await LoginRecords.updateOne({login_token:req.value.body.token},{$set :{is_active : 0}});
        req.user_data = {};
        res.statusCode = 400;
        res.send(resp('SUC',"Successfully logout",''));
    }
}