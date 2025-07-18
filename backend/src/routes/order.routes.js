import {
  createOrder,
  confirmOrder,
  updateOrder,
  getOrders,
  getOrderById,
} from "../controllers/order.controllers.js";
import { auth } from "../middlewares/auth.middlewares.js";

export const orderRoutes = async(fastify, option) => {
    fastify.addHook("preHandler", async (request, reply) => {
        const isAuthenticated = await auth(request, reply);
        if (!isAuthenticated) {
            return reply.code(401).send({message: "Unauthorized"})
        }
    })

    fastify.post("/order", createOrder);
    fastify.get("/order", getOrders);
    fastify.patch("/order/:orderId/status", updateOrder);
    fastify.post("/order/:orderId/confirm", confirmOrder);
    fastify.get("/order/:orderId", getOrderById);
}