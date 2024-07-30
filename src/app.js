import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json());

app.use(cookieParser());


app.use(express.urlencoded({extended: true}))

// router imports 

import userRouter from "./routes/user.router.js"
import adminRouter from "./routes/admin.router.js"

//router declaration

app.use('/api/v1/users', userRouter)
app.use('/api/v1/admin', adminRouter)

