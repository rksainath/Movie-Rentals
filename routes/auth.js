const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Users} = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/', async (req,res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Username is invalid');

    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Password is invalid');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(user){
    const schema = {
        email: Joi.string().min(5).max(55).required().email(),
        password: Joi.string().min(5).max(55).required()
        }
    
        return Joi.validate(user,schema);
    }

module.exports = router;