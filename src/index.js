import dotenv from "dotenv"
import { connectDb } from "./db/index.js"
import { app } from "./app.js";

dotenv.config({ path: "./env" })//Loads env variables from .env file. Since env variables are of immediate requirements thy must be initialised as soon as execution starts. Thats why we added -r dot/env n package.json in run script so that the env varables are loaded before application starts


connectDb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server listening on ${process.env.PORT || 8000}`);
        })
    })
    .catch((err) => {
        console.error(`MongoDb error ${err}`);
    });