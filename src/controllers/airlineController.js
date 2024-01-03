import { validateRequiredFields } from '../shared/validateRequiredField'
import { connectToDatabase } from '../../db/connection'
import { makeResponse } from '../shared/makeResponse'

const createAirline = async (req, res) => {
  const requiredFields = ['name', 'icao', 'country', 'callsign']
  if (!validateRequiredFields(req, res, requiredFields)) {
    return
  }
  const { airlineCollection } = await connectToDatabase()
  await makeResponse(res, async () => {
    await airlineCollection.insert(req.params.id, req.body)
    res.status(201)
    return req.body
  })
}

const getAirline = async (req, res) => {
  const { airlineCollection } = await connectToDatabase()
  await makeResponse(res, async () => {
    let getResult = await airlineCollection.get(req.params.id)
    return getResult['content']
  })
}

const updateAirline = async (req, res) => {
  const requiredFields = ['name', 'icao', 'country', 'callsign']
  if (!validateRequiredFields(req, res, requiredFields)) {
    return
  }
  const { airlineCollection } = await connectToDatabase()
  await makeResponse(res, async () => {
    await airlineCollection.upsert(req.params.id, req.body)
    return req.body
  })
}

const deleteAirline = async (req, res) => {
  const { airlineCollection } = await connectToDatabase()
  await makeResponse(res, async () => {
    await airlineCollection.remove(req.params.id)
    res.status(204)
    return
  })
}

const listAirlines = async (req, res) => {
  const { scope } = await connectToDatabase()
  // Fetching parameters
  const country = req.query.country || ''
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0
  let query
  let options
  if (country !== '') {
    query = `
        SELECT airline.callsign,
               airline.country,
               airline.iata,
               airline.icao,
               airline.name
        FROM airline AS airline
        WHERE airline.country = $COUNTRY
        ORDER BY airline.name
        LIMIT $LIMIT
        OFFSET $OFFSET;
      `
    options = { parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset } }
  } else {
    query = `
        SELECT airline.callsign,
               airline.country,
               airline.iata,
               airline.icao,
               airline.name
        FROM airline AS airline
        ORDER BY airline.name
        LIMIT $LIMIT
        OFFSET $OFFSET;
      `

    options = { parameters: { LIMIT: limit, OFFSET: offset } }
  }
  await makeResponse(res, async () => {
    let results = await scope.query(query, options)
    return results['rows']
  })
}

const listAirlinesToAirport = async (req, res) => {
  const { scope } = await connectToDatabase()
  // Fetching parameters
  const airport = req.query.airport
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0
  let query
  let options
  query = `
		SELECT air.callsign,
			air.country,
			air.iata,
			air.icao,
			air.name
		FROM (
			SELECT DISTINCT META(airline).id AS airlineId
			FROM route
			JOIN airline ON route.airlineid = META(airline).id
			WHERE route.destinationairport = $AIRPORT
		) AS subquery
		JOIN airline AS air ON META(air).id = subquery.airlineId
		ORDER BY air.name
		LIMIT $LIMIT
		OFFSET $OFFSET;
      `
  options = { parameters: { AIRPORT: airport, LIMIT: limit, OFFSET: offset } }
  await makeResponse(res, async () => {
    let results = await scope.query(query, options)
    return results['rows']
  })
}

export {
  createAirline,
  getAirline,
  updateAirline,
  deleteAirline,
  listAirlines,
  listAirlinesToAirport,
}
