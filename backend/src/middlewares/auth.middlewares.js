import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const auth = asyncHandler(async (req, reply) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        throw new apiError(401, "Access token required")
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    return true
})

export {auth}