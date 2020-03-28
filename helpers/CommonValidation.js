const Joi = require('joi');
const {resp} = require('../helpers/ResponseHelper');

module.exports = {
    validateParam : (schema,name)=> {
        return (req,res,next) => {
            const result = Joi.validate({param:req['params'][name]},schema); //req['params][name] means sometime we send userid and sometime we send carid in differecne method call
            if(result.error){
                return res.status(400).json(resp('IRP', result.error.details[0].message));
            }
            else{
                if(!req.value)
                {
                    req.value = {};
                }
                if(!req.value['params']){
                    req.value['params'] = {}; 
                }
                req.value['params'][name] = result.value.param;
                next();
            }
        }
    },
    validateBody : (schema)=>{
        return (req, res, next) => {
            const result = Joi.validate(req.body,schema);
            if(result.error)
            {
                return res.status(400).json(resp('IRP',result.error.details[0].message));
            }
            else {
                if(!req.value)
                {
                    req.value = {}
                }
                if(!req.value['body']){
                    req.value['body'] = {}
                }
                req.value['body'] = result.value;
                next();
            }
        }
    },
    schemas: {
        //User Schema parameter
        RegiterSchema  :Joi.object().keys({
            first_name : Joi.string().min(3).required(),
            last_name : Joi.string().min(3).required(),
            email : Joi.string().email().required(),
            password : Joi.string().min(6).required(),
            mobile : Joi.string().regex(/^[6-9][0-9]{9}$/).required(),
        }),
        loginSchema  :Joi.object().keys({
            email : Joi.string().email().required(),
            password : Joi.string().required(),
        }),
        updateRoleSchema : Joi.object().keys({
            email : Joi.string().email().required(),
            role_id :  Joi.number().required(),
        }),
       /*  updateActivateSchema: Joi.object().keys({
            email : Joi.string().email().required(),
            is_activa :  Joi.number().min(1).max(1).required(),
        }), */
        //Blog Schema parameter
        createBlogSchema: Joi.object().keys({
            title   :   Joi.string().min(10).required(),
            slug    :   Joi.string().min(10).required(),
            metatitle : Joi.string().required(),
            summary :   Joi.string().required(),
            content :Joi.string().required()
        }),
        //Admin Schema parameter
        
        //common validation for all controller if id in get
        idSchema : Joi.object().keys({
            param : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().
                    error(() => {
                        return {
                            message  : `Invalid User id`
                        }
                    })
        })
    }
}