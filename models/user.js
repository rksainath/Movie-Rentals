const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 55
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength:255
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin:{
        type: Boolean
    }

});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin}, config.get("jwtPrivateKey"));
    return token;
} 

const Users = mongoose.model('user', userSchema );   


function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().min(5).max(55).required().email(),
        password: Joi.string().min(5).max(55).required()
        }
    
        return Joi.validate(user,schema);
    }
    
    exports.Users = Users;
    exports.validate = validateUser;