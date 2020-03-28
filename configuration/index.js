const result = require('dotenv').config();

//IF ENVIRONMENT IS DEVELOPMENT
//THEN get environment variables from .env file
// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV == 'developemnt'){
    if(result.error)
    {
        throw result.error;
    }
}

const {parsed: envs} = result;
envs.ENVIRONMENT = process.env.NODE_ENV;
module.exports =  envs;