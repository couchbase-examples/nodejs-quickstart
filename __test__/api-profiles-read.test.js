import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

import { delay } from '../src/delay'

const profile1 = {
  pid: v4(), firstName: "Joe", lastName: "Schmoe",
  email: "joe.schmoe@couchbase.com", pass: bcrypt.hashSync('mypassword1', 10)
}
const profile2 = {
  pid: v4(), firstName: "John", lastName: "Dear",
  email: "john.dear@couchbase.com", pass: bcrypt.hashSync('mypassword2', 10)
}

beforeAll(async () => {
  await profileCollection.insert(profile1.pid, profile1)
    .then(() => {/*console.log('test profile document inserted', profile)*/ })
    .catch((e) => console.log(`test profile insert failed: ${e.message}`))
  await profileCollection.insert(profile2.pid, profile2)
    .then(() => {/*console.log('test profile document inserted', profile)*/ })
    .catch((e) => console.log(`test profile insert failed: ${e.message}`))
})

beforeEach(async() => await delay(2000))

describe("GET /profiles", () => {
  describe("given we get profiles with skip 1, limit 2, and search text of 'jo'", () => {
    test("should respond with status code 200 OK and return two documents", async () => {
      const response = await request(app)
        .get(`/profiles`)
        .query({
          skip: 0, limit: 2, search: 'jo'
        })
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveLength(2)
    })
  })
})

afterAll(async () => {
  await profileCollection.remove(profile1.pid)
    .then(() => { /*console.log('test profile document deleted', id)*/ })
    .catch((e) => console.log(`test profile remove failed: ${e.message}`))
  await profileCollection.remove(profile2.pid)
    .then(() => { /*console.log('test profile document deleted', id)*/ })
    .catch((e) => console.log(`test profile remove failed: ${e.message}`))
  cluster.close()
})