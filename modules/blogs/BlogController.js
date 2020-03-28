const Blog = require('./BlogModel');
const {resp} = require('../../helpers/ResponseHelper');
const jwt  = require('jsonwebtoken');
const User = require('../users/UserController');

module.exports = {
    create_blog: async(req,res,next) => {
      const blogData = req.value.body;  
    },
    update_blog: async() => {

    },
    delete_blog: async() => {

    }
}

