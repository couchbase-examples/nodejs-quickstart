import express from "express";
import {
  createAirport,
  getAirport,
  updateAirport,
  deleteAirport,
  listAirport,
  ListDirectConnection,
} from "../controllers/airportController";

const router = express.Router();

router.get("/list", listAirport);

router.get("/direct-connections", ListDirectConnection);

router.post("/:id", createAirport);

router.get("/:id", getAirport);

router.put("/:id", updateAirport);

router.delete("/:id", deleteAirport);

export default router;