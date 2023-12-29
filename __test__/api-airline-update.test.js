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

describe('PUT /api/v1/airline/{id}', () => {
  describe('given the airline object is updated', () => {
    const id = 'airline_777'
    const initialAirline = {
      name: 'Initial Test Name',
      icao: 'INITIALTEST',
      callsign: 'TEST-AIR',
      country: 'Initial Test Country',
      id: '777',
    }
    const updatedAirline = {
      name: 'Update Test Name',
      icao: 'UPDATETEST',
      callsign: 'UTEST-AIR',
      country: 'Update Test Country',
      id: '777',
    }

    beforeEach(async () => {
      const { airlineCollection } = await connectToDatabase()
      await airlineCollection
        .insert(id, initialAirline)
        .then(() => {
          /*console.log('test airline document inserted', airline)*/
        })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      const response = await request(app)
        .put(`/api/v1/airline/${id}`)
        .send(updatedAirline)
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toBe(updatedAirline.name)
      expect(response.body.icao).toBe(updatedAirline.icao)
      expect(response.body.country).toBe(updatedAirline.country)
    })

    afterEach(async () => {
      const { airlineCollection } = await connectToDatabase()
      await airlineCollection
        .remove(id)
        .then(() => {
          /*console.log('test airline document deleted', id)*/
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })
  })
})
