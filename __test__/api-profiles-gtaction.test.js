import {
  request, describe, test, expect, //supertes
} from './imports'

afterAll(async() => cluster.close())

describe("GT Action Test", () => {
  describe("xxx", () => {

    test("should work, or else really broken", async() => {
      expect(true).toBe(true)
      console.log('Hello World style test')
    })

  })
})
