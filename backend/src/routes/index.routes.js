import { authRoutes } from "./auth.routes.js";
import { orderRoutes } from "./order.routes.js";
import { categoryRoutes, productRoutes } from "./products.routes.js";

const prefix = "/api/v1"

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes,{prefix: prefix})
    fastify.register(productRoutes,{prefix: prefix})
    fastify.register(categoryRoutes,{prefix: prefix})
    fastify.register(orderRoutes,{prefix: prefix})
}