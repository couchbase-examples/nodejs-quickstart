import {
  request, describe, test, expect, //supertes
  connectToDatabase,      // couchbase
  app                       // REST application
} from './imports'


afterAll(async () => {
  const { cluster } = await connectToDatabase();
  await cluster.close()
})

describe("POST /api/v1/airline/{id}", () => {

  describe("given a request with airline data", () => {
    const expected = { statusCode: 201, message: '' }
    let id
    test('should respond with statusCode 200 and return document persisted', async () => {
      const airline = {
        name: 'Test Name', icao: 'TEST',
        country: 'Test Country', id: '777'
      }
      id = 'airline_777'
      const response = await request(app).post(`/api/v1/airline/${id}`).send(airline)

      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body).toMatchObject({
        name: airline.name, icao: airline.icao, country: airline.country
      })
    })

    afterEach(async () => {
      const { airlineCollection } = await connectToDatabase();
      await airlineCollection.remove(id)
        .then(() => { console.log('test airline document deleted', id) })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })

  })
})