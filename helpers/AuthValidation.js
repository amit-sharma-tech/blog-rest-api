const {resp} = require('./ResponseHelper');
const User = require('../modules/users/UserModel');
const LoginRecord = require('../modules/users/LoginRecord');
var CryptoJS = require("crypto-js");
var md5 = require('md5');
require('dotenv').config();

module.exports  ={
    validate_token  : async(req,res,next) => {
        console.log(req.value.body.token,'req data');
        if(!req.value.body.token)
        {
            res.status(200).json(resp('IRP', 'Invalid or Empty API Token'));
        }
        const check_token  = await LoginRecord.findOne({$and:[
                    {login_token: req.value.body.token},
                    // {is_active:1},
                    // {"loginAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}}
                ]},
                {user_id: 1,is_active:1,_id:0}
            );
            
        if(!check_token){
            res.status(200).json(resp('ERR', 'Token is not created, try again'));
        }
        else{
            console.log(req,'full request');
            if(!check_token.is_active){
                res.status(200).json(resp('ERR', 'User session expired'));
            }
            const check_user = await User.findById({_id:check_token.user_id});
            if(!check_user){
                res.status(200).json(resp('ERR', 'No user found'));               
            }
            if(check_user.is_active !== 1){
                res.status(200).json(resp('ERR', 'User is not active'));               
            }
            req.user_data = {
                id          :   check_user._id,
                full_name   :   check_user.first_name+' '+ check_user.last_name, 
                email       :   check_user.email,
                is_active   :   check_user.is_active,
                role_id     :   check_user.role_id,
                mobile      :   check_user.mobile,
                connected   :   check_user.connected,
            };
            return next();
        }
    },
    auth  : async(req,res,next) => {
        if(req.isAuthenticated){
            const user = await User.findOne({email:req.user.email});
            //if not handle it
            if(user.connected=== false){
                return res.status(400).json(resp('ERR', 'User has logout'));
            }
            return next();
        }
        else{
            return res.status(400).json(resp('ERR', 'User not login'));
        }
    },
    validate_user: async(req, res,next) => {
        if(req.isAuthenticated){
            if(req.user.is_active !== 1){
                return res.status(400).json(resp('ERR', 'User is not active'));
            }
            if(req.user.role_id !== 1){
                return res.status(400).json(resp('ERR', 'Only role id 1 can create the blog'));
            }
        }
    }
}