import dotenv from "dotenv"
import { connectDb } from "./db/index.js"

dotenv.config({ path: "./env" })//Loads env variables from .env file. Since env variables are of immediate requirements thy must be initialised as soon as execution starts.


connectDb();