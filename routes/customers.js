const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customers, validate} = require('../models/customer');
const auth = require('../middleware/auth');



router.get('/',async (req,res)=>{

    const customer = await Customers.find().sort('genre')
    res.send(customer); 

});

router.get('/:id', async (req,res)=>{
    try{
        const customer = await Customers.findById(req.params.id);
        res.send(customer);
    }
    catch(exception){
        return res.send(`The customer with id ${req.params.id} is not found!`);
    }
    

});

router.post('/',auth, async (req,res)=>{
    
    const { error } = validate(req.body);
    if(error)   return res.status(400).send(error.details[0].message);
    
    const customer = new Customers({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);

});

router.put('/:id',auth, async (req,res)=>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const customer = await Customers.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        },{new:true});
        res.send(customer);
    }
    catch(exception){
        return res.send(`The customer with id ${req.params.id} is not found!`);
    }

    

});

router.delete('/:id',auth, async (req,res)=>{
    
    try{
        const customer = await Customers.findByIdAndRemove(req.params.id);
        res.send(customer);
    }
    catch(exception){
        return res.send(`The customer with id ${req.params.id} is not found!`);
    }
    

});



module.exports = router;