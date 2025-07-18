import {
    fetchUser,
    loginCustomer,
    loginDeliveryPartner,
    refreshAccessToken,
    updateUser
} from "../controllers/auth.controllers.js";
import { auth } from "../middlewares/auth.middlewares.js";

export const authRoutes = async (fastify, options) => {
    fastify.post("/customer/login", loginCustomer)
    fastify.post("/delivery/login", loginDeliveryPartner)
    fastify.post("/refresh-token", refreshAccessToken)
    fastify.get("/user",{preHanler: [auth]}, fetchUser)
    fastify.patch("/user",{preHanler: [auth]}, updateUser)

}