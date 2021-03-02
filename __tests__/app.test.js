require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

   

    test('returns all todos', async() => {
      const todo = [ {
        todo: 'laundry',
        completed: false,
      }
      ];
      const expected = {
        id: 2,
        todo: 'laundry',
        completed: false,
        user_id: 1,
      }
     

      const data = await fakeRequest(app)
        .get('/api/todos')
        .send(todo)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
       // .expect(200);

      expect(data.body).toEqual(expected);
    });
  });
});
