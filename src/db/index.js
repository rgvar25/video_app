import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//Connection of Database using a function and exporting it. 
//Function would be invoked in main index.js
//Can also be done using IIFE function in main index. However this approach is more clean and modular


//Always write connection code in try-catch block since dbs often throw exceptions
//It requires time to set up a connection so always use a async  await since db is located on cloud in different locations


export async function connectDb() {
    try {
        const connectedInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDb Connected " + connectedInstance.connection);
    } catch (err) {
        console.error(`MongoDb related Error: ${err}`);
        process.exit(1) //forceful termination of node process. 1 indicates termination due to failure.
    }

}