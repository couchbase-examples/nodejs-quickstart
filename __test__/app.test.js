import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import { app } from '../src/app'

import { cluster, profileCollection } from '../db/connection'

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

describe("GET /profiles/{id}", () => {
  describe("given we pass a pid as request param", () => {
    const id = v4()
    const profile = {
      pid: id, firstName: "Joseph", lastName: "Developer",
      email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
    }

    beforeEach(async () => {
      await profileCollection.insert(id, profile)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })
    afterEach(async () => {
      await profileCollection.remove(id)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and return profile as object", async () => {
      const response = await request(app).get(`/profiles/${id}`).send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(profile)
    })

  })
})

describe("DELETE /profiles/{id}", () => {
  describe("given we pass a pid as request param", () => {
    const id = v4()

    beforeEach(async () => {
      const profile = {
        pid: id, firstName: "Joseph", lastName: "Developer",
        email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
      }
      await profileCollection.insert(id, profile)
        .then(() => {/*console.log('test item inserted', profile)*/ })
        .catch((e) => console.log(`Test Profile Insert Failed: ${e.message}`))
    })

    test("should respond with status code 200 OK", async () => {
      const response = await request(app).delete(`/profiles/${id}`).send()
      expect(response.statusCode).toBe(200)
    })

  })
})

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

    beforeEach(async () => {
      await profileCollection.insert(id, initialProfile)
        .then(() => {/*console.log('test profile document inserted', profile)*/ })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })
    afterEach(async () => {
      await profileCollection.remove(id)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and updated values of document returned", async () => {
      const response = await request(app).put(`/profiles/${id}`).send(updatedProfile)
      expect(response.statusCode).toBe(200)
      expect(response.body.firstName).toBe(updatedProfile.firstName)
      expect(response.body.lastName).toBe(updatedProfile.lastName)
      expect(response.body.email).toBe(updatedProfile.email)
      expect(response.body.pass).not.toBe(updatedProfile.pass)
    })

  })
})

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

    beforeEach(async () => {
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
    afterEach(async () => {
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

    test("should respond with status code 200 OK and return two documents", async () => {
      const response = await request(app).get(`/profiles`).send({
        skip: 1, limit: 2, searchFirstName: 'jo'
      })
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(2)
    })

  })
})
