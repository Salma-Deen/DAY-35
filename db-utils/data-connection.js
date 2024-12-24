import mongoose from "mongoose";

const url="mongodb://127.0.0.1:27017";
const dbName="task3";

export const connectViaMongoose = async () => {
    try {
        await mongoose.connect(`${url}/${dbName}`);
        console.log("Connected to DB via Mongoose");
    }
    catch (e) {
        console.log("Error in connecting", e);
        process.exit(1);
    }
};