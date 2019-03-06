const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Rentals, validate} = require('../models/rental');
const {Movies} = require('../models/movie');
const {Customers} = require('../models/customer');
const Fawn = require('fawn');
const auth = require('../middleware/auth');

Fawn.init(mongoose);

router.get('/',async (req,res)=>{

    const rentals = await Rentals.find().sort('-dateOut');
    res.send(rentals); 

});

router.get('/:id', async (req,res)=>{
    try{
        const rental = await Rentals.findById(req.params.id);
        res.send(rental);
    }
    catch(exception){
        return res.send(`The rental with id ${req.params.id} is not found!`);
    }
    

});

router.post('/',auth, async (req,res)=>{
    
    const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customers.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rentals({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

    try
    {
    new Fawn.Task()
    .save('rentals',rental)
    .update('movies',{_id:movie._id},{$inc:{numberInStock:-1}})
    .run();
    res.send(rental);
    }catch(err){
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