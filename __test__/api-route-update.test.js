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

describe('PUT /api/v1/route/{id}', () => {
  describe('given the route object is updated', () => {
    const id = 'route_777'
    const initialRoute = {
      airline: 'Initial Test Airline',
      airlineid: 'Initial Test AirlineId',
      sourceairport: 'Initial Test Airport',
      id: '777',
      destinationairport: 'TESTFAA',
    }
    const updatedRoute = {
      airline: 'Updated Test Airline',
      airlineid: 'Updated Test AirlineId',
      sourceairport: 'Updated Test Airport',
      id: '777',
      destinationairport: 'TESTQAA',
    }

    beforeEach(async () => {
      const { routeCollection } = await connectToDatabase()
      await routeCollection
        .insert(id, initialRoute)
        .then(() => {
          /*console.log('test route document inserted', route)*/
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      const response = await request(app)
        .put(`/api/v1/route/${id}`)
        .send(updatedRoute)
      expect(response.statusCode).toBe(200)
      expect(response.body.Airline).toBe(updatedRoute.Airline)
      expect(response.body.Airline_id).toBe(updatedRoute.Airline_id)
      expect(response.body.SourceAirport).toBe(updatedRoute.SourceAirport)
      expect(response.body.DestinationAirport).toBe(
        updatedRoute.DestinationAirport,
      )
    })

    afterEach(async () => {
      const { routeCollection } = await connectToDatabase()
      await routeCollection
        .remove(id)
        .then(() => {
          /*console.log('test route document deleted', id)*/
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
