import { Category } from "../models/index.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCategories = asyncHandler(async (req, reply) => {
    const category = await Category.find();
    return reply.status(200).send(
        new apiResponse(
            200,
            category,
            "category successfully fetch"
        )
    )
})

export {getAllCategories}