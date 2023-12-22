import {
  request, describe, test, expect, //supertes
  connectToDatabase,      // couchbase
  app                            // REST application
} from './imports'


afterAll(async() => {
  const { cluster } = await connectToDatabase();
  await cluster.close()
})

describe("PUT /api/v1/airport/{id}", () => {
  describe("given the airport object is updated", () => {
    const id = 'airport_777'
    const initialAirport = {
        airportName: 'Initial Test Name', city: 'Initial Test City',
        country: 'Initial Test Country', id: '777', faa: 'TESTFAA'
    }
    const updatedAirport = {
        airportName: 'Updated Test Name', city: 'Updated Test City',
        country: 'Updated Test Country', id: '777', faa: 'TESTFAA'
    }

    beforeEach(async() => {
      const { airportCollection } = await connectToDatabase();
      await airportCollection.insert(id, initialAirport)
        .then(() => {/*console.log('test airport document inserted', airport)*/ })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and updated values of document returned", async() => {
      const response = await request(app).put(`/api/v1/airport/${id}`).send(updatedAirport)
      expect(response.statusCode).toBe(200)
      expect(response.body.airportName).toBe(updatedAirport.airportName)
      expect(response.body.city).toBe(updatedAirport.city)
      expect(response.body.country).toBe(updatedAirport.country)
    })
  

    afterEach(async() => {
      const { airportCollection } = await connectToDatabase();
      await airportCollection.remove(id)
        .then(() => {/*console.log('test airport document deleted', id)*/ })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })

  })
})