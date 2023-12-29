import express from 'express'
import {
  createRoute,
  getRoute,
  updateRoute,
  deleteRoute,
} from '../controllers/routeController'

const router = express.Router()

router.post('/:id', createRoute)

router.get('/:id', getRoute)

router.put('/:id', updateRoute)

router.delete('/:id', deleteRoute)

export default router
