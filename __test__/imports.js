import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import { app } from '../src/app'

import { connectToDatabase } from '../db/connection'



module.exports = {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  app                              // REST application
}
