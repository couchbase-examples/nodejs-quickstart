import {
    request, describe, test, expect, //supertes
    connectToDatabase,      // couchbase
    app                       // REST application
  } from './imports'
  
  
  afterAll(async () => {
    const { cluster } = await connectToDatabase();
    await cluster.close()
  })
  
  describe("POST /api/v1/route/{id}", () => {
  
    describe("given a request with route data", () => {
      const expected = { statusCode: 201, message: '' }
      let id
      test('should respond with statusCode 200 and return document persisted', async () => {
        const route = {
            airline: 'Test Airline', airlineid: 'Test AirlineId',
            sourceairport: 'Test Airport', id: '777', destinationairport: 'TESTFAA'
        }
        id = 'route_777'
        const response = await request(app).post(`/api/v1/route/${id}`).send(route)
  
        expect(response.statusCode).toBe(expected.statusCode)
        expect(response.body).toMatchObject({
            airline: route.airline, airlineid: route.airlineid, sourceairport: route.sourceairport, destinationairport: route.destinationairport
        })
      })
  
      afterEach(async () => {
        const { routeCollection } = await connectToDatabase();
        await routeCollection.remove(id)
          .then(() => { console.log('test route document deleted', id) })
          .catch((e) => console.log(`test route remove failed: ${e.message}`))
      })
  
    })
  })