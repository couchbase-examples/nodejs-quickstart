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

describe('POST /api/v1/airport/{id}', () => {
  describe('given a request with airport data', () => {
    const expected = { statusCode: 201, message: '' }
    let id
    test('should respond with statusCode 201 and return document persisted', async () => {
      const airport = {
        airportName: 'Test Name',
        city: 'Test City',
        country: 'Test Country',
        id: '777',
        faa: 'TESTFAA',
      }
      id = 'airport_777'
      const response = await request(app)
        .post(`/api/v1/airport/${id}`)
        .send(airport)

      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body).toMatchObject({
        airportName: airport.airportName,
        city: airport.city,
        country: airport.country,
        faa: airport.faa,
      })
    })

    afterEach(async () => {
      const { airportCollection } = await connectToDatabase()
      await airportCollection
        .remove(id)
        .then(() => {
          console.log('test airport document deleted', id)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
