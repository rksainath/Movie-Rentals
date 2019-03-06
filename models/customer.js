const Joi = require('joi');
const mongoose = require('mongoose');

const Customers = mongoose.model('customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    },
    phone:{
        type: Number,
        required:true,
        minlength: 5,
        maxlength: 55
    },
    isGold:{
        type: Boolean,
        default: false
    }
    }));

function validateCustomer(newCustomer){
    const schema = {
            name: Joi.string().min(5).max(55).required(),
            phone: Joi.string().min(5).max(55).required(),
            isGold: Joi.boolean()
        }
    
        return Joi.validate(newCustomer,schema);
    }
    
    exports.Customers = Customers;
    exports.validate = validateCustomer;