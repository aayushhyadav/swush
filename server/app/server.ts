import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { IndexController } from "./routes/index";

const app = express();
const result = dotenv.config();
const PORT = process.env.PORT || 5000;

if (result.error) {
  throw result.error;
}

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/", IndexController);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
