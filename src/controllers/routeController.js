import { validateRequiredFields } from '../shared/validateRequiredField'
import { makeResponse } from '../shared/makeResponse'

const createRoute = async (req, res) => {
  const requiredFields = [
    'airline',
    'airlineid',
    'sourceairport',
    'destinationairport',
  ]
  if (!validateRequiredFields(req, res, requiredFields)) {
    return
  }
  await makeResponse(res, async ({ routeCollection }) => {
    await routeCollection.insert(req.params.id, req.body)
    res.status(201)
    return req.body
  })
}

const getRoute = async (req, res) => {
  await makeResponse(res, async ({ routeCollection }) => {
    let getResult = await routeCollection.get(req.params.id)
    return getResult['content']
  })
}

const updateRoute = async (req, res) => {
  const requiredFields = [
    'airline',
    'airlineid',
    'sourceairport',
    'destinationairport',
  ]
  if (!validateRequiredFields(req, res, requiredFields)) {
    return
  }
  await makeResponse(res, async ({ routeCollection }) => {
    await routeCollection.upsert(req.params.id, req.body)
    return req.body
  })
}

const deleteRoute = async (req, res) => {
  await makeResponse(res, async ({ routeCollection }) => {
    await routeCollection.remove(req.params.id)
    res.status(204)
    return req.body
  })
}

export { createRoute, getRoute, updateRoute, deleteRoute }
