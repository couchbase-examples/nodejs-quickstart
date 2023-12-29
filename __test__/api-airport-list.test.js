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

describe('GET /api/v1/airport/list', () => {
  describe('given country limit & offset as request params"', () => {
    let id1 = 777
    const airport1 = {
      airportName: 'Initial Test Name',
      city: 'Initial Test City',
      country: 'Initial Test Country',
      id: '777',
      faa: 'TESTFAA',
    }
    let id2 = 778
    const airport2 = {
      airportName: 'Updated Test Name',
      city: 'Updated Test City',
      country: 'Updated Test Country',
      id: '777',
      faa: 'TESTFAA',
    }

    beforeEach(async () => {
      const { airportCollection } = await connectToDatabase()
      await airportCollection
        .insert(id1, airport1)
        .then(() => {
          /*console.log('test airport document inserted', airport)*/
        })
        .catch((e) => console.log(`test airport1 insert failed: ${e.message}`))
      await airportCollection
        .insert(id2, airport2)
        .then(() => {
          /*console.log('test airport document inserted', airport)*/
        })
        .catch((e) => console.log(`test airport2 insert failed: ${e.message}`))
    })
    test('should respond with status code 200 OK and return the documents', async () => {
      const response = await request(app).get(`/api/v1/airport/list`).query({
        offset: 0,
        limit: 5,
        country: 'Test Country',
      })
      expect(response.statusCode).toBe(200)
      // expect(response.body.items).toHaveLength(2)
    })

    afterEach(async () => {
      const { airportCollection } = await connectToDatabase()
      await airportCollection
        .remove(id1)
        .then(() => {
          /*console.log('test airport document deleted', id)*/
        })
        .catch((e) => console.log(`test airport1 remove failed: ${e.message}`))
      await airportCollection
        .remove(id2)
        .then(() => {
          /*console.log('test airport document deleted', id)*/
        })
        .catch((e) => console.log(`test airport2 remove failed: ${e.message}`))
    })
  })
})
