import {
    request, describe, test, expect, //supertes
    connectToDatabase,      // couchbase
    app                            // REST application
  } from './imports'
  
  
  
  
  afterAll(async() => {
    const { cluster } = await connectToDatabase();
    await cluster.close()
  })
  
  describe("DELETE /api/v1/airport/{id}", () => {
    describe("given we pass a id as request param", () => {
  
      beforeEach(async() => {
        const { airportCollection } = await connectToDatabase();
        const airport = {
            airportName: 'Test Name', city: 'Test City',
            country: 'Test Country', id: '777', faa: 'TESTFAA'
        }
        const id = 'airport_777'
  
        await airportCollection.insert(id, airport)
          .then(() => {/*console.log('test item inserted', airport)*/ })
          .catch((e) => console.log(`Test airport Insert Failed: ${e.message}`))
      })
  
      test("should respond with status code 204 Deleted", async() => {
        const id='airport_777'
  
        const response = await request(app).delete(`/api/v1/airport/${id}`).send()
        expect(response.statusCode).toBe(204)
      })
  
    })
  })
  