const { Users, validate} = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/me',auth, async (req,res)=>{
const user = await Users.findById(req.user._id).select('-password');
res.send(user);
});

router.post('/', async (req,res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists!')

    user = new Users( _.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['id','name','email']));
});

module.exports = router;