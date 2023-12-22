import { AirportModel } from "../models/airportModel"
import { connectToDatabase } from '../../db/connection'
import { makeResponse } from "../shared/makeResponse";

const createAirport = async (req, res) => {
    const { airportCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await airportCollection.insert(req.params.id, req.body)
        res.status(201);
        return req.body;
    });
};


const getAirport = async (req, res) => {
    const { airportCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        let getResult = await airportCollection.get(req.params.id)
        return getResult["content"];
    });
};

const updateAirport = async (req, res) => {
    const { airportCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await airportCollection.upsert(req.params.id, req.body)
        return req.body;
    });
};

const deleteAirport = async (req, res) => {
    const { airportCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await airportCollection.remove(req.params.id)
        res.status(204);
        return req.body;
    });
};

const listAirport = async (req, res) => {
    const { scope } = await connectToDatabase();
    // Fetching parameters
    const country = req.query.country || '';
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    let query;
    let options;
    if (country !== '') {
        query = `
        SELECT airport.airportname,
        airport.city,
        airport.country,
        airport.faa,
        airport.geo,
        airport.icao,
        airport.tz
    FROM airport AS airport
    WHERE airport.country=$COUNTRY
    ORDER BY airport.airportname
    LIMIT $LIMIT
    OFFSET $OFFSET;
      `;
        options = { parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset } }
    } else {
        query = `
        SELECT airport.airportname,
        airport.city,
        airport.country,
        airport.faa,
        airport.geo,
        airport.icao,
        airport.tz
    FROM airport AS airport
    ORDER BY airport.airportname
    LIMIT $LIMIT
    OFFSET $OFFSET;
      `;

        options = { parameters: { LIMIT: limit, OFFSET: offset } }
    }
    await makeResponse(res, async () => {
        let results = await scope.query(query, options);
        return results["rows"]
    });
}

const ListDirectConnection = async (req, res) => {
    const { scope } = await connectToDatabase();
    // Fetching parameters
    const airport = req.query.airport;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    let query;
    let options;
    query = `
	SELECT DISTINCT route.destinationairport
	FROM airport AS airport
	JOIN route AS route ON route.sourceairport = airport.faa
	WHERE airport.faa = $AIRPORT AND route.stops = 0
	ORDER BY route.destinationairport
	LIMIT $LIMIT
	OFFSET $OFFSET
      `;
    options = { parameters: { AIRPORT: airport, LIMIT: limit, OFFSET: offset } }
    await makeResponse(res, async () => {
        let results = await scope.query(query, options);
        return results["rows"]
    });
}

export {
    createAirport,
    getAirport,
    updateAirport,
    deleteAirport,
    listAirport,
    ListDirectConnection,
};

