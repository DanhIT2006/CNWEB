import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import commentRouter from "./routes/commentRoute.js";
import shopRouter from "./routes/shopRoute.js";
import couponRouter from "./routes/couponRoute.js";

// app config
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/comment", commentRouter);
app.use("/api/shop", shopRouter);
app.use("/api/coupon", couponRouter);



app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(5000,()=>{
    console.log(`Server Started on http://localhost:5000`)
})
