const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movies, validate} = require('../models/movie');
const {Genres} = require('../models/genre')
const auth = require('../middleware/auth');


router.get('/',async (req,res)=>{

    const movies = await Movies.find().sort('title');
    res.send(movies); 

});

router.get('/:id', async (req,res)=>{
    try{
        const movie = await Movies.findById(req.params.id);
        res.send(movie);
    }
    catch(exception){
        return res.send(`The movie with id ${req.params.id} is not found!`);
    }
    

});

router.post('/',auth, async (req,res)=>{
    
    const { error } = validate(req.body);
    if(error)   return res.status(400).send(error.details[0].message);

    try{
        const genre = await Genres.findById(req.body.genreId);
        const movie = new Movies({
            title: req.body.title,
            genre: {
                _id:genre._id,
                genre:genre.genre
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        try{
        await movie.save();
        res.send(movie);
        }catch(err){
            res.send(err);
        }
        
    }catch(err){
        res.send(err);
    }
    
    

        
    

});

router.put('/:id',auth, async (req,res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const genre = await Genres.findById(req.body.genreId);
    

       try{
            const movie = await Movies.findByIdAndUpdate(req.params.id,
                {
                title: req.body.title,
                genre: 
                    {
                    _id:genre._id,
                    genre:Genres.genre
                    },
                 numberInStock: req.body.numberInStock,
                 dailyRentalRate: req.body.dailyRentalRate
                 },{new:true});
        res.send(movie);
    }
    catch(exception){
        return res.send(`The movie with id ${req.params.id} is not found!`);
    }
    }catch(err)
        {
        res.send(err);
        }
    

});

router.delete('/:id',auth, async (req,res)=>{
    
    try{
        const movie = await Movies.findByIdAndRemove(req.params.id);
        res.send(movie);
    }
    catch(exception){
        return res.send(`The movie with id ${req.params.id} is not found!`);
    }
    

});



module.exports = router;