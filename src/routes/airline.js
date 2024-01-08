import express from 'express'
import {
  createAirline,
  getAirline,
  updateAirline,
  deleteAirline,
  listAirlines,
  listAirlinesToAirport,
} from '../controllers/airlineController'

const router = express.Router()

router.get('/list', listAirlines)

router.get('/to-airport', listAirlinesToAirport)

router.post('/:id', createAirline)

router.get('/:id', getAirline)

router.put('/:id', updateAirline)

router.delete('/:id', deleteAirline)

export default router
