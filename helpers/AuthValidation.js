const {resp} = require('./ResponseHelper');
const User = require('../modules/users/UserModel');

module.exports  ={
    auth : async(req,res,next) => {
        // console.log(req,'req');
        // req.isAuthenticated= false;
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