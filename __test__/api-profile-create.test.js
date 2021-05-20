import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

afterAll(async() => cluster.close())

describe('POST /profile', () => {

  const profile = {
    firstName: 'Joe', lastName: 'dev',
    email: 'joe@dev.com', pass: 'p455w3rd'
  }

  describe('given a request with user & pass', () => {
    const expected = { statusCode: 200, message: 'email and pass are required' }
    let pid

    console.log(`start of the test - this should be removed and is for debugging only `)

    test('should respond with statusCode 200 and return document persisted', async() => {
      const response = await request(app).post('/profile').send(profile)
      console.log(`log response from request ${response}`)
      pid = response.body.pid
      const hashedPass = response.body.pass

      delete response.body.pid; delete response.body.pass

      expect(response.statusCode).toBe(expected.statusCode)
      bcrypt.compare(profile.pass, hashedPass, function(err, result) {
        expect(result).toBe(true)
      });
      expect(pid.length).toBe(36)
      expect(response.body).toMatchObject({
        firstName: profile.firstName, lastName: profile.lastName, email: profile.email
      })
    })

    afterEach(async() => {
      await profileCollection.remove(pid)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })
  
  describe('given a request without user & pass', () => {
    const expected = { statusCode: 400, message: 'email and pass are required' }
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async() => {
      const response = await request(app).post('/profile').send({
        firstName: profile.firstName,
        lastName: profile.lastName
      })
      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body.message).toBe(expected.message)
    })
  })

  describe('given the email is missing', () => {
    const expected = { statusCode: 400, message: 'email is required' }
    test(`should respond with statusCode 400 and message: ${expected.message}`, async() => {
      const response = await request(app).post('/profile').send({
        firstName: profile.firstName,
        lastName: profile.lastName,
        pass: profile.pass
      })
      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body.message).toBe(expected.message)
    })
  })

  describe('given the pass is missing', () => {
    const expected = { statusCode: 400, message: 'pass is required' }
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async() => {
      const response = await request(app).post('/profile').send({
        firstName: profile.firstName, 
        lastName: profile.lastName, 
        email: profile.email
      })
      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body.message).toBe(expected.message)
    })
  })

})
