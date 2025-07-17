import dotenv from "dotenv";
import fastify from "fastify"
import { connectDB } from "./configs/db.js";
import { PORT } from "./configs/config.js";
const app = fastify()

 dotenv.config({
   path: "./env",
 });

connectDB()

app.listen({port:PORT,host:"0.0.0.0"}, () => {
      console.log(`Server running at port !!! ${PORT}`);
});


