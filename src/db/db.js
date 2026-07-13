import mongoose from "mongoose";
import 'dotenv/config'
import { DB_NAME } from "../constants.js";

 const connectDB = async() =>{
   try {
      const conn =  await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
        console.log("DATABASE CONNCETED SUCCESSFULLY");
        console.log( "DB host :",conn.connection.host);
        
        
   } catch (error) {
     console.log("database connection failed" ,error);  
     process.exit(1)
   }
}

 export default connectDB;