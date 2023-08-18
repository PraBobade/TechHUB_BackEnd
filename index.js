import express from "express";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: "/.env" });
import cors from 'cors'
import route from "./Routes/UserRoute.js";
import categoryRoute from './Routes/CategoryRoute.js'
import ProductRoute from './Routes/ProductRoute.js'
import BrainTreeRoute from './Routes/BrainTreeRoute.js'
import ConnectToMongoDB from "./Config/DataBase.js";

const PORT = process.env.PORT || 5002

const app = express();
app.use(cors());
app.use(express.json());

ConnectToMongoDB(`mongodb://127.0.0.1:27017/${process.env.MONGO_DATABASE}`);

//Auth Routes 
app.use('/api/v1/auth', route);
// Category Routes
app.use('/api/v1/category', categoryRoute);
// Product Routes
app.use('/api/v1/product', ProductRoute);
// BrainTree routes
app.use('/api/v1/', BrainTreeRoute);

app.listen(PORT)