import mongoose from "mongoose";
import dotenv from 'dotenv';
import logger from "../utils/logger.js";

dotenv.config();

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        logger.info('Connected to MongoDB');

    }
    catch(err){
        logger.error('Error connecting to MongoDB', err.message);
        process.exit(1);
        

    }
}
export default connectDb;