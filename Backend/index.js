import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/connectdb.js"
import { Userroute } from "./Router/userRoute.js"
import { ResumeRouter } from "./Router/resumeRouter.js"
import cors from "cors"
import { getAnalytics } from "./controller/resume_controller.js"
dotenv.config()
const app=express()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json())
app.use("/api/auth",Userroute)
app.use("/api/resume",ResumeRouter)
app.get("/",(req,res)=>{
    return res.send("hello backend")
})
// getAnalytics()
const port=process.env.PORT
app.listen(port,()=>{
    console.log("server running at",port)
    connectDb()
})

