
const request = require('supertest');
const { Genres } = require('../../models/genre');
const { Users } = require('../../models/user');
let server;

describe('/api/genres',()=>{
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach(async ()=>{
        server.close();
        await Genres.remove({});
    });

    describe('GET /', ()=>{
        it('should return all the genres',async()=>{
            await Genres.collection.insertMany([
                {genre: 'genre1'},
                {genre: 'genre2'}
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.genre === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.genre === 'genre2')).toBeTruthy();

            
        });
        
    });
});

    describe('GET /:id',()=>{
        it('should return a genre corresponding to the id', async()=>{
            const genre = new Genres(
                {genre: 'genre3'}
            );
            await genre.save();

            const res = await request(server).get('/api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genre',genre.genre);

        });

        it('should return a 404 if invalid id is passed', async()=>{
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
            
        });
    
    });

    describe('POST /',()=>{
         
        let token;
        let genre;

         const exec = async ()=>{
            return await request(server)
                            .post('/api/genres')
                            .set('x-auth-token',token)
                            .send({genre:genre});
        }

        beforeEach(()=>{
            token = new Users().generateAuthToken();
            genre = 'genre1'
        });

        it('should return 401 if the user is not logged in', async()=>{
            token ='';
            const res = await exec();
            expect(res.status).toBe(401);

        });

        it('should return 400 if the genre is less than 5 characters', async()=>{
            
            genre = '1234';
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return 400 if the genre is more than 50 characters', async()=>{
            
            genre = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should save the genre if it is valid', async()=>{
            
            await exec();
            const genre = Genres.find({name:'genre1'});
            expect(genre).not.toBeNull;

        });

        it('should save the genre if the id is valid', async()=>{
            
            const res = await exec();            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('genre');

        });
    });