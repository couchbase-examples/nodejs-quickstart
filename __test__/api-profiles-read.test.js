import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'
import { ensureProfileIndex } from '../src/app'

import { delay } from '../src/delay'

beforeAll(async() => await ensureProfileIndex())
afterAll(async() => cluster.close())

describe("GET /profiles", () => {
  describe("given we get profiles with skip 1, limit 2, and searchFirstName starts with 'jo'", () => {
    const profile1 = {
      pid: v4(), firstName: "Joe", lastName: "Schmoe",
      email: "joe.schmoe@couchbase.com", pass: bcrypt.hashSync('mypassword1', 10)
    }
    const profile2 = {
      pid: v4(), firstName: "John", lastName: "Dear",
      email: "john.dear@couchbase.com", pass: bcrypt.hashSync('mypassword2', 10)
    }
    const profile3 = {
      pid: v4(), firstName: "Jon", lastName: "Jones",
      email: "jon.jones@couchbase.com", pass: bcrypt.hashSync('mypassword3', 10)
    }
    const profile4 = {
      pid: v4(), firstName: "Johnny", lastName: "Doh",
      email: "johnny.doh@couchbase.com", pass: bcrypt.hashSync('mypassword4', 10)
    }

    beforeEach(async() => {
      await profileCollection.insert(profile1.pid, profile1)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(profile2.pid, profile2)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(profile3.pid, profile3)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(profile4.pid, profile4)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and return two documents", async() => {
      const response = await request(app)
        .get(`/profiles`)
        .query({
          skip: 1, limit: 2, searchFirstName: 'jo'
        })
        console.log(response.body)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveLength(2)
    })

    afterEach(async() => {
      await delay(2000)
      await profileCollection.remove(profile1.pid)
        .then(() => { /*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(profile2.pid)
        .then(() => { /*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(profile3.pid)
        .then(() => { /*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(profile4.pid)
        .then(() => { /*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })
})
