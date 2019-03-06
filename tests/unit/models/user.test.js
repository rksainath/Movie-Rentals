const config = require('config');
const mongoose = require('mongoose');
const { Users } = require('../../../models/user');
const jwt = require('jsonwebtoken');

describe('user.generateAuthToken',()=>{
    it('should return a valid authentication token',()=>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const user = new Users(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
       expect(decoded).toMatchObject(payload); 
    });
})