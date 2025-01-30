import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config"
import {dbConnect} from "./config/index";
import userRoutes from "./routes/userRoute";
import productRoutes from "./routes/productRoute";


const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors({
    credentials : true
}));
app.use(compression());
app.use(cookieparser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.use("/api/users",userRoutes);
app.use("/api/v1/products",productRoutes);


server.listen(PORT,()=>{
    console.log(`Server is listening on port on ${PORT}`);
    dbConnect();
});
