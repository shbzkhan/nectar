import { Product } from "../models/index.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProductsByCategoryId = asyncHandler(async (req, reply) => {
    const { categoryId } = req.params;
    const products = await Product.find({category: categoryId}).select("-category").exec()
    return reply.status(200).send(
        new apiResponse(200, products, "product fetchedy")
    )
})
export {getProductsByCategoryId}