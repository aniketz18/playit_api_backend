import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser); 



app.get('/', (req, res) =>{
    res.send("server is working..🚀")
} )


import userRouter from './routes/user.routes.js'  

app.use('/api/v1/users' ,userRouter );
//http://localhost:3000/api/v1/users/register  >>>>>  register  enpoint



export { app };
