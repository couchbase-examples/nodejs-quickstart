import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

afterAll(async() => cluster.close())

describe("PUT /profiles", () => {
  describe("given the profile object is updated", () => {
    const id = v4()
    const initialProfile = {
      pid: id, firstName: "Joseph", lastName: "Developer",
      email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
    }
    const updatedProfile = {
      firstName: "Joe", lastName: "dev",
      email: "joe@dev.com", pass: "p455w3rd"
    }

    beforeEach(async() => {
      await profileCollection.insert(id, initialProfile)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })
    afterEach(async() => {
      await profileCollection.remove(id)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and updated values of document returned", async() => {
      const response = await request(app).put(`/profiles/${id}`).send(updatedProfile)
      expect(response.statusCode).toBe(200)
      expect(response.body.firstName).toBe(updatedProfile.firstName)
      expect(response.body.lastName).toBe(updatedProfile.lastName)
      expect(response.body.email).toBe(updatedProfile.email)
      expect(response.body.pass).not.toBe(updatedProfile.pass)
    })

  })
})
