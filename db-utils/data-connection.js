import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const host = "127.0.0.1:27017";
const dbName = "Localdb";

const localDbUrl = `mongodb://${host}/${dbName}`;
export const connectViaMongoose = async () => {
    try {
        await mongoose.connect(localDbUrl);
        console.log("Connected to DB via Mongoose");
    }
    catch (e) {
        console.log("Error in connecting", e);
        process.exit(1);
    }
};
