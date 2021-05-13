import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

afterAll(async () => cluster.close())

describe("POST /profiles", () => {
  describe("given a user & pass", () => {
    var pid
    const profile = {
      firstName: "Joe", lastName: "dev",
      email: "joe@dev.com", pass: "p455w3rd"
    }
    beforeEach(async () => { })
    afterEach(async () => {
      await profileCollection.remove(pid)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and return document inserted", async () => {
      const response = await request(app).post("/profiles").send(profile)
      expect(response.statusCode).toBe(200)
      pid = response.body.pid
      const pass = response.body.pass
      expect(response.body).toMatchObject({ pid, ...profile, pass })
    })

  })
  describe("given the email is missing", () => {
    const profile = { firstName: "Joe", lastName: "dev", pass: "p455w3rd" }
    test("should respond with status code 400 and message: 'email is required'", async () => {
      const response = await request(app).post("/profiles").send(profile)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('email is required')
    })
  })
  describe("given the pass is missing", () => {
    const profile = { firstName: "Joe", lastName: "dev", email: "joe@dev.com" }
    test("should respond with status code 400 and message: 'pass is required'", async () => {
      const response = await request(app).post("/profiles").send(profile)
      expect(response.body.message).toBe('pass is required')
    })
  })
  describe("given user and pass are missing", () => {
    const profile = { firstName: "Joe", lastName: "dev" }
    test("should respond with status code 400 and message: 'email and pass are required'", async () => {
      const response = await request(app).post("/profiles").send(profile)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('email and pass are required')
    })
  })
})
