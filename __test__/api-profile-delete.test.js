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

describe("DELETE /profile/{id}", () => {
  describe("given we pass a pid as request param", () => {
    const id = v4()

    beforeEach(async() => {
      const { profileCollection } = await connectToDatabase();
      const profile = {
        pid: id, firstName: "Joseph", lastName: "Developer",
        email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
      }
      await profileCollection.insert(id, profile)
        .then(() => {/*console.log('test item inserted', profile)*/ })
        .catch((e) => console.log(`Test Profile Insert Failed: ${e.message}`))
    })

    test("should respond with status code 200 OK", async() => {
      const response = await request(app).delete(`/profile/${id}`).send()
      expect(response.statusCode).toBe(200)
    })

  })
})
