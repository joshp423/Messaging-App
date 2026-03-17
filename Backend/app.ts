import "dotenv/config";
import express from "express";
import indexRouter from "./routes/indexRouter.js";
import path from "node:path";
import cors from "cors";
const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/", indexRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Messaging-App-Backend - listening on port ${PORT}!`);
});