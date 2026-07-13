
import connectDB from './src/db/db.js'

connectDB()



// the same file approach
/* import mongoose from "mongoose";
import 'dotenv/config'
import { DB_NAME } from "./src/constants.js";

 ;( async() =>  {
    try {
       await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
       console.log("connected database..");
       
    } catch (error) {
        console.log(error);
        
    }
 })(); */