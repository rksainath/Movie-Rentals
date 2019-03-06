const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genres,validate} = require('../models/genre');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const winston = require('winston');


router.get('/',async (req,res)=>{
    // throw new Error('Could not get the genres.');
    const genres = await Genres.find().sort('genre');
    res.status(200).send(genres);
});

router.get('/:id',validateObjectId, async (req,res)=>{
    
    try{
        const genre = await Genres.findById(req.params.id);
        res.status(200).send(genre);
    }
    catch(ex){
        return res.status(500).send(`The genre with id ${req.params.id} is not found!`);
    }
    

});

router.post('/', auth, async (req,res)=>{
    
    const { error } = validate(req.body);
    if(error)   return res.status(400).send(error.details[0].message);
    
    let genre = new Genres({
        genre: req.body.genre
    });
    genre = await genre.save()
    res.send(genre);

});

router.put('/:id',auth, async (req,res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const genre = await Genres.findByIdAndUpdate(req.params.id,{
            genre: req.body.genre
        },{new:true});
        res.send(genre);
    }
    catch(exception){
        return res.send(`The genre with id ${req.params.id} is not found!`);
    }

    

});

router.delete('/:id',[auth,admin], async (req,res)=>{
    
    try{
        const genre = await Genres.findByIdAndRemove(req.params.id);
        res.send(genre);
    }
    catch(exception){
        return res.send(`The genre with id ${req.params.id} is not found!`);
    }
    

});


module.exports = router;