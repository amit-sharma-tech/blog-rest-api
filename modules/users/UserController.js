const User = require('./UserModel');
const {resp} = require('../../helpers/ResponseHelper');
const jwt  = require('jsonwebtoken');
/* const DataModel = require('../../helpers/DataModel');
const FetchData = new DataModel(); */
signToken = user =>{
    var userToken = "";
    if(user.id.length > 0){
        userToken = jwt.sign(
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
    else{
        userToken = "";
    }
    return userToken
}

module.exports = {
    signUp : async(req, res, next) => {
        const data = req.value.body;
        const emailExist = await User.findOne({email:data.email});
        if(emailExist)
        {
            return res.status(400).json(resp('ERR', 'User already exist'));
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
            res.status(200).json({
                statuscode : resp('SUC'),
                message    : "Successfully Register"
                // token : signToken(saveUser)
            }) ;
        }
    },
    signIn: async(req, res, next) =>{
        const token = signToken(req.user);
        console.log(req.user, token + '--token');
        res.status(200).json({
            statuscode: resp('SUC'),
            message: "Succesfully login",
            token : token
        });
    },
    secret : async (req, res, next) =>{
        res.status(200).json({
            message: "Succesfully secret",
            // token : token
        });
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
            res.status(200).json({
                statuscode: resp('SUC'),
                message:'User role has updated successfully'
            });
        } 
        else{
            return res.status(400).json(resp('ERR', 'User is not found'));
        }
    },
    logout : async(req, res, next) => {
        await User.updateOne({_id:req.user._id},{$set :{connected : false}});
        const token = signToken();
        console.log(req.user, token + '--token');
        res.status(200).json({
            message: "Successfully logout",
            // token : token
        });
    }
}