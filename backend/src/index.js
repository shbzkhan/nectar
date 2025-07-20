import dotenv from "dotenv";
import fastify from "fastify"
import { connectDB } from "./configs/db.js";
import { PORT } from "./configs/config.js";
import { registerRoutes } from "./routes/index.routes.js";
import fastifySocketIO from "fastify-socket.io";
import { buildAdminRouter } from "./configs/setup.js";
const app = fastify()

 dotenv.config({
   path: "./env",
 });

connectDB()


app.register(fastifySocketIO, {
  cors: {
    origin: '*',
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports:["websocket"]
})

await registerRoutes(app)
await buildAdminRouter(app)

app.listen({port:PORT,host:"0.0.0.0"}, () => {
      console.log(`Server running at port !!! ${PORT}`);
});

app.ready().then(() => {
  app.io.on('connection', (socket) => {
    console.log("A User Connected")

    socket.on("joinRoom", (orderId) => {
      socket.join(orderId);
      console.log("User Joined room ", orderId)
    })
    socket.on("disconnect", () => {
      console.log("User Disconnected")
    })
  })
})


