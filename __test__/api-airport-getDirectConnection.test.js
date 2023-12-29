import {
  request,
  describe,
  test,
  expect,
  connectToDatabase,
  app,
} from './imports'

afterAll(async () => {
  const { cluster } = await connectToDatabase()
  await cluster.close()
})

describe('GET /api/v1/airport/routes', () => {
  describe('given airport, limit & offset as request params', () => {
    let airportId = 'airport_777'
    const airportData = {
      airportName: 'Initial Test Name',
      city: 'Initial Test City',
      country: 'Initial Test Country',
      id: '777',
      faa: 'SFO',
    }
    let routeId = 'route_777'
    const routeData = {
      airline: 'Test Airline',
      airlineid: 'Test AirlineId',
      sourceairport: 'SFO',
      id: '777',
      destinationairport: 'Test Destination Airport',
    }
    beforeEach(async () => {
      const { airportCollection, routeCollection } = await connectToDatabase()

      // Insert test data into the airport collection
      await airportCollection
        .insert(airportId, airportData)
        .then(() => {
          /*console.log('test airport document inserted', airportData);*/
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))

      // Insert test data into the route collection
      await routeCollection
        .insert(routeId, routeData)
        .then(() => {
          /*console.log('test route document inserted', routeData);*/
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return the documents', async () => {
      const response = await request(app)
        .get(`/api/v1/airport/direct-connections`)
        .query({
          airport: 'SFO',
          limit: 5,
          offset: 0,
        })
      expect(response.statusCode).toBe(200)
    })

    afterEach(async () => {
      const { airportCollection, routeCollection } = await connectToDatabase()

      // Remove test data from the airport collection
      await airportCollection
        .remove(airportId)
        .then(() => {
          /*console.log('test airport document deleted', airportId);*/
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))

      // Remove test data from the route collection
      await routeCollection
        .remove(routeId)
        .then(() => {
          /*console.log('test route document deleted', 'routeId');*/
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
