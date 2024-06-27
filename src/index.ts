import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from './routes';
import morgan from 'morgan'; // Import morgan as ES module

import { errorHandler } from "./middlewares/errorHandler";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(morgan('dev')); // 'dev' is a predefined log format in morgan
app.use(express.json()); // Add this line to parse JSON requests

app.use(routes);


app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});