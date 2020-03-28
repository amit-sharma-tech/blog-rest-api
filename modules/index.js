
const router = require('express-promise-router')();
const {validateParam,validateBody,schemas} = require('../helpers/CommonValidation');
const passport = require('passport');
const passportConf = require('../helpers/passport');
const passportSignIn = passport.authenticate('local',{session: false});
const passportJWT = passport.authenticate('jwt',{session: false});
const userController = require('./users/UserController');
const blogController = require('./blogs/BlogController');
const userAuthenication = require('../helpers/AuthValidation');

//user Router
router.route('/users/register')
    .post(validateBody(schemas.RegiterSchema),userController.signUp);

router.route('/users/login')
    .post(validateBody(schemas.loginSchema),passportSignIn,userController.signIn);

router.route('/users/secret')
    .post(validateBody(schemas.tokenSchema), userAuthenication.validate_token, userController.secret);

router.route('/users/update_role')
    .post(validateBody(schemas.updateRoleSchema),passportJWT, userAuthenication.auth, userController.updateRole);

// router.route('/users/update_role')
    // .post(validateBody(schemas.updateRoleSchema),passportJWT, userAuthenication.auth, userController.updateRole);

    
router.route('/users/logout')
    .post(validateBody(schemas.tokenSchema),userAuthenication.validate_token,userController.logout);

//Blog router

router.route('/blog/create_blog')
    .post(validateBody(schemas.createBlogSchema),passportJWT,userAuthenication.auth, userAuthenication.validate_user,blogController.create_blog);

    
module.exports = router;