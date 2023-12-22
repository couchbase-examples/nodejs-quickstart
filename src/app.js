import express from "express";
import cors from "cors";
import airlineRoutes from "./routes/airline";
import airportRoutes from "./routes/airport";
import route from "./routes/route";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send(
    '<body onload="window.location = \'/swagger-ui/\'"><a href="/swagger-ui/">Click here to see the API</a>',
  );
});

app.use("/api/v1/airline", airlineRoutes);
app.use("/api/v1/airport", airportRoutes);
app.use("/api/v1/route", route);

app.get("*", (req, res) => {
  console.log(`Received request for: ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

export { app }