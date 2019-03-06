const request = require('supertest');
const { Users } = require('../../models/user');
let server;

describe('auth test',()=>{
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async ()=>{
        server.close();
    });

    let token;
    let genre;

     const exec = ()=>{
        return request(server)
                        .post('/api/genres')
                        .set('x-auth-token',token)
                        .send({genre:genre});
    }

    beforeEach(()=>{
        token = new Users().generateAuthToken();
        genre = 'genre1'
    });
    it('should return 401 if no token is provided',async ()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
});
it('should return 400 if an invalid token is provided',async ()=>{
    token='a';
    const res = await exec();
    expect(res.status).toBe(400);
});
});