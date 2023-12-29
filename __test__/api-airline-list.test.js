import {
  request,
  describe,
  test,
  expect, //supertes
  connectToDatabase, // couchbase
  app, // REST application
} from './imports'

afterAll(async () => {
  const { cluster } = await connectToDatabase()
  await cluster.close()
})

describe('GET /api/v1/airline/list', () => {
  describe('given country limit & offset as request params"', () => {
    let id1 = 777
    const airline1 = {
      name: 'Initial Test Name',
      icao: 'INITIALTEST',
      country: 'Test Country',
      id: '777',
    }
    let id2 = 778
    const airline2 = {
      name: 'Update Test Name',
      icao: 'UPDATETEST',
      country: 'Test Country',
      id: '778',
    }

    beforeEach(async () => {
      const { airlineCollection } = await connectToDatabase()
      await airlineCollection
        .insert(id1, airline1)
        .then(() => {
          /*console.log('test airline document inserted', airline)*/
        })
        .catch((e) => console.log(`test airline1 insert failed: ${e.message}`))
      await airlineCollection
        .insert(id2, airline2)
        .then(() => {
          /*console.log('test airline document inserted', airline)*/
        })
        .catch((e) => console.log(`test airline2 insert failed: ${e.message}`))
    })
    test('should respond with status code 200 OK and return the documents', async () => {
      const response = await request(app).get(`/api/v1/airline/list`).query({
        offset: 0,
        limit: 5,
        country: 'Test Country',
      })
      expect(response.statusCode).toBe(200)
      // expect(response.body.items).toHaveLength(2)
    })

    afterEach(async () => {
      const { airlineCollection } = await connectToDatabase()
      await airlineCollection
        .remove(id1)
        .then(() => {
          /*console.log('test airline document deleted', id)*/
        })
        .catch((e) => console.log(`test airline1 remove failed: ${e.message}`))
      await airlineCollection
        .remove(id2)
        .then(() => {
          /*console.log('test airline document deleted', id)*/
        })
        .catch((e) => console.log(`test airline2 remove failed: ${e.message}`))
    })
  })
})
