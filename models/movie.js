const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { genreSchema } = require('../models/genre')

const Movies = mongoose.model('movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    genre:{
        type:genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
    }
    }));

function validateMovie(newMovie){
    const schema = {
        title: Joi.string().min(1).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
        }
    
        return Joi.validate(newMovie,schema);
    }
    
    exports.Movies = Movies;
    exports.validate = validateMovie;