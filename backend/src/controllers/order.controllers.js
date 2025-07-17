import { Customer, Branch, Order } from "../models/index.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createOrder = asyncHandler(async (req, reply) => {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);
    if (!customerData) {
        throw new apiError(404, "User not found")
    }

    const newOrder = new Order({
      customer: userId,
      items: items.map((item) => ({
        id: items.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitute,
        address: customerData.address || "No address available",
      },
      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitute,
        address: branchData.address || "No address available",
      },
    });
    const saveOrder = await newOrder.save();
    
    return reply.status(200).send(new apiResponse(200, saveOrder, "Order created"));
})