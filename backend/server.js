import express from 'express';
import 'dotenv/config'
import connectDB from './utils/database.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth-router.js';
import cloudRouter from './routes/cloud-router.js';
import cors from 'cors'

const app = express()

app.use(cors({ 
    origin: 'http://localhost:5173',    
    credentials: true
 }))

app.use(cookieParser())

app.use(express.json())

app.use("/api/auth/", authRouter)
app.use("/api/cloud/", cloudRouter)


connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}).catch((err) => {
    console.log(err)
})