import { getAllCategories } from "../controllers/category.controllers.js";
import { getProductsByCategoryId } from "../controllers/product.controllers.js";

export const categoryRoutes = async (fastify, options) => {
    fastify.get("/categroies", getAllCategories)
}
export const productRoutes = async (fastify, options) => {
    fastify.get("/products/:categoryId", getProductsByCategoryId)
}