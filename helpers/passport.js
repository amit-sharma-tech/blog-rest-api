const passport = require('passport');
const JwtStrategy   = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local');
const User = require('../modules/users/UserModel');
const {resp} = require('./ResponseHelper');
require('dotenv').config();

//JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : process.env.TOKEN_SECRET
}, async(payload, done) => {
    try{ 
        //Find the user specified in token
        const user = await User.findById(payload.userId);
        // If user does not exists handle it
        if(!user){
            return done(null,false,{ message: 'Unknown user or invalid password'} );
        }
        //otherwise return the user
        user_data = {
            id          :   user._id,
            full_name   :   user.first_name+' '+ user.last_name, 
            email       :   user.email,
            is_active   :   user.is_active,
            role_id     :   user.role_id,
            mobile      :   user.mobile,
            connected   :   user.connected,
        };
        
        done(null,user_data);
    } catch(err) {
        done(error, false);
    }
}));

//LCOAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    try{
        console.log(email, password);
        //Find the user given email
        const user = await User.findOne({email:email});
        //if not handle it
        console.log(user,user);

        if(user == null){
            done(null, false ,{ message: 'Unknown user or invalid password'} );
        }
        else if(!user.password){
            return done(null, false, { message: 'Password does not exists' });
        }
        //check if password is correct
        var records = new User();
        var isMatchPwd = records.comparePassword(password, user.password);
        //if not handle it
        if(isMatchPwd === false){
            return done(null, false);
        }else{
            //otherwise return the user
            user_data = {
                id          :   user._id,
                full_name   :   user.first_name+' '+ user.last_name, 
                email       :   user.email,
                is_active   :   user.is_active,
                role_id     :   user.role_id,
                mobile      :   user.mobile,
                connected   :   user.connected,
            };
            done(null,user_data);
            
        }
    }catch(error){
        done(error,false); 
    }
}));

