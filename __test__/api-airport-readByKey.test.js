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

describe('GET /api/v1/airport/{id}', () => {
  describe('given we pass a id as request param', () => {
    const id = 'airport_777'
    const airport = {
      airportName: 'Test Name',
      city: 'Test City',
      country: 'Test Country',
      id: '777',
      faa: 'TESTFAA',
    }

    beforeEach(async () => {
      const { airportCollection } = await connectToDatabase()
      await airportCollection
        .insert(id, airport)
        .then(() => {
          /*console.log('test airport document inserted', airport)*/
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return airport as object', async () => {
      const response = await request(app).get(`/api/v1/airport/${id}`).send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(airport)
    })

    afterEach(async () => {
      const { airportCollection } = await connectToDatabase()
      await airportCollection
        .remove(id)
        .then(() => {
          /*console.log('test airport document deleted', id)*/
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
