import { RouteModel } from "../models/routeModel"
import { connectToDatabase } from '../../db/connection'
import { makeResponse } from "../shared/makeResponse";

const createRoute = async (req, res) => {
    const { routeCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await routeCollection.insert(req.params.id, req.body)
        res.status(201);
        return req.body;
    });
};


const getRoute = async (req, res) => {
    const { routeCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        let getResult = await  routeCollection.get(req.params.id)
        return getResult["content"];
    });
};

const updateRoute = async (req, res) => {
    const { routeCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await routeCollection.upsert(req.params.id, req.body)
        return req.body;
    });
};

const deleteRoute = async (req, res) => {
    const { routeCollection } = await connectToDatabase();
    await makeResponse(res, async () => {
        await routeCollection.remove(req.params.id)
        res.status(204);
        return req.body;
    });
};

export {
    createRoute,
    getRoute,
    updateRoute,
    deleteRoute,
};