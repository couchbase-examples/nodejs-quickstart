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

describe('GET /api/v1/airline/list', () => {
  describe('given airport, limit & offset as request params', () => {
    let id1 = 777
    const airline1 = {
      name: 'Initial Test Name',
      icao: 'INITIALTEST',
      country: 'Test Country',
      id: '777',
    }
    let id2 = 778
    const airline2 = {
      name: 'Update Test Name',
      icao: 'UPDATETEST',
      country: 'Test Country',
      id: '778',
    }

    beforeEach(async () => {
      const { airlineCollection, routeCollection } = await connectToDatabase()

      // Insert test data into the route collection
      const routeData = {
        destinationairport: 'FAA',
        airlineid: id1,
      }

      await routeCollection
        .insert('routeId', routeData)
        .then(() => {
          /*console.log('test route document inserted', routeData);*/
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))

      // Insert test data into the airline collection
      await airlineCollection
        .insert(id1, airline1)
        .then(() => {
          /*console.log('test airline document inserted', airline1);*/
        })
        .catch((e) => console.log(`test airline1 insert failed: ${e.message}`))

      await airlineCollection
        .insert(id2, airline2)
        .then(() => {
          /*console.log('test airline document inserted', airline2);*/
        })
        .catch((e) => console.log(`test airline2 insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return the documents', async () => {
      const response = await request(app).get(`/api/v1/airline/list`).query({
        offset: 0,
        limit: 5,
        airport: 'FAA',
      })
      expect(response.statusCode).toBe(200)
    })

    afterEach(async () => {
      const { airlineCollection, routeCollection } = await connectToDatabase()

      // Remove test data from the route collection
      await routeCollection
        .remove('routeId')
        .then(() => {
          /*console.log('test route document deleted', 'routeId');*/
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))

      // Remove test data from the airline collection
      await airlineCollection
        .remove(id1)
        .then(() => {
          /*console.log('test airline document deleted', id1);*/
        })
        .catch((e) => console.log(`test airline1 remove failed: ${e.message}`))

      await airlineCollection
        .remove(id2)
        .then(() => {
          /*console.log('test airline document deleted', id2);*/
        })
        .catch((e) => console.log(`test airline2 remove failed: ${e.message}`))
    })
  })
})
