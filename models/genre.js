const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    }
    });
const Genres = mongoose.model('genre', genreSchema);

    function validateGenre(newGenre){
        const schema = {
            genre: Joi.string().min(5).max(50).required()
        }
    
        return Joi.validate(newGenre,schema);
    }
    
    exports.genreSchema = genreSchema;
    exports.Genres = Genres;
    exports.validate = validateGenre;
