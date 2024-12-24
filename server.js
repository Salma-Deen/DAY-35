import express from "express";

import { connectViaMongoose } from "./db-utils/data-connection.js";
import mentorRouter from "./routes/mentors.js";
import studentRouter from "./routes/students.js";
const server = express();
server.use(express.json());
server.use("/mentor",mentorRouter);
server.use("/student",studentRouter);
const PORT = 5400;

await connectViaMongoose();
server.listen(PORT, () => {
    console.log("server listening on", PORT);
});