import mongoose from "mongoose";
import { MONGO_URL } from "../app/config.js";

console.log("BADABOUN");
console.log(`Connect to MONGO : ${MONGO_URL}`);
//Set up default mongoose connection

mongoose.connect(MONGO_URL); // Get Mongoose to use the global promise library

let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("CONNECTED OK"));

export default db;
