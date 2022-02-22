import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  app                              // REST application
} from './imports'

afterAll(async() => {
  const { cluster } = await connectToDatabase();
  await cluster.close()
})

describe("GET /profile/{id}", () => {
  describe("given we pass a pid as request param", () => {
    const id = v4()
    const profile = {
      pid: id, firstName: "Joseph", lastName: "Developer",
      email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
    }

    beforeEach(async() => {
      const { profileCollection } = await connectToDatabase();
      await profileCollection.insert(id, profile)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and return profile as object", async() => {
      const response = await request(app).get(`/profile/${id}`).send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(profile)
    })

    afterEach(async() => {
      const { profileCollection } = await connectToDatabase();
      await profileCollection.remove(id)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })
})
