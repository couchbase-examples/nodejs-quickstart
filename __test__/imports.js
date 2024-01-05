import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import { app } from '../src/app'

import { connectToDatabase } from '../db/connection'

module.exports = {
  request,
  describe,
  test,
  expect, // supertest
  connectToDatabase, // couchbase
  app, // REST application
}
