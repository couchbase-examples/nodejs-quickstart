import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

afterAll(async() => cluster.close())

describe("GET /profiles", () => {
  describe("given we get profiles with skip 1, limit 2, and searchFirstName for 'jo'", () => {
    const id1 = v4()
    const id2 = v4()
    const id3 = v4()
    const id4 = v4()
    const profile1 = {
      pid: id1, firstName: "Joe", lastName: "Schmoe",
      email: "joe.schmoe@couchbase.com", pass: bcrypt.hashSync('mypassword1', 10)
    }
    const profile2 = {
      pid: id2, firstName: "John", lastName: "Dear",
      email: "john.dear@couchbase.com", pass: bcrypt.hashSync('mypassword2', 10)
    }
    const profile3 = {
      pid: id3, firstName: "Jon", lastName: "Jones",
      email: "jon.jones@couchbase.com", pass: bcrypt.hashSync('mypassword3', 10)
    }
    const profile4 = {
      pid: id4, firstName: "Johnny", lastName: "Doh",
      email: "johnny.doh@couchbase.com", pass: bcrypt.hashSync('mypassword4', 10)
    }

    beforeEach(async() => {
      await profileCollection.insert(id1, profile1)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(id2, profile2)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(id3, profile3)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profileCollection.insert(id4, profile4)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })
    afterEach(async() => {
      await profileCollection.remove(id1)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(id2)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(id3)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await profileCollection.remove(id4)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and return two documents", async() => {
      const response = await request(app).get(`/profiles`).send({
        skip: 1, limit: 2, searchFirstName: 'jo'
      })
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(2)
    })

  })
})
