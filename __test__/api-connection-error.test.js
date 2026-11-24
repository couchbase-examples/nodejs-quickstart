import request from 'supertest'
import { describe, test, expect, jest } from '@jest/globals'

// Simulate an unreachable cluster. This test needs no Couchbase Server.
jest.mock('../db/connection', () => ({
  connectToDatabase: jest.fn(() =>
    Promise.reject(new Error('unable to connect to cluster')),
  ),
}))

import { app } from '../src/app'

describe('when the database connection cannot be established', () => {
  test.each([
    ['get', '/api/v1/airline/airline_10'],
    ['get', '/api/v1/airline/list'],
    ['get', '/api/v1/airline/to-airport?airport=SFO'],
    ['delete', '/api/v1/airline/airline_10'],
    ['get', '/api/v1/airport/airport_1254'],
    ['get', '/api/v1/airport/list'],
    ['get', '/api/v1/airport/direct-connections?airport=SFO'],
    ['get', '/api/v1/route/route_10000'],
    ['delete', '/api/v1/route/route_10000'],
  ])('%s %s responds with a 500 JSON error body', async (method, path) => {
    const response = await request(app)[method](path)

    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body).toEqual({ message: 'unable to connect to cluster' })
  })

  test('POST with a valid body responds with a 500 JSON error body', async () => {
    const response = await request(app).post('/api/v1/route/route_new').send({
      airline: 'AF',
      airlineid: 'airline_137',
      sourceairport: 'TLV',
      destinationairport: 'MRS',
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({ message: 'unable to connect to cluster' })
  })
})
