import { Customer, Branch, DeliveryPartner, Order } from "../models/index.js";
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

const confirmOrder = asyncHandler(async (req, reply) => {
  const { orderId } = req.params;
  const { userId } = req.user;
  const { deliveryPersonLocation } = req.body;
  const deliveryPerson = await DeliveryPartner.findById(userId);
  
  if (!deliveryPerson) {
    throw new apiError(404, "Delivery Person not found");
  }
  const order = await Order.findById(orderId);

  if (!order) {
    throw new apiError(404, "Order not found");
  }
  if (order.status !== "available") {
    throw new apiError(404, "Order not found");
  }
  order.status = "confirmed"

  order.deliveryPartner = userId

  order.deliveryPersonLocation = {
    latitude: deliveryPersonLocation?.latitude,
    longitude: deliveryPersonLocation?.longitute,
    address: deliveryPersonLocation?.address || "",
  };

  req.server.io.to(orderId).emit("orderConfirmed", order)
  await order.save()

  return reply.status(200).send(
    new apiResponse(200, order, "order confirm success")
  )

})

const updateOrder = asyncHandler(async (req, reply) => {
  const { orderId } = req.params;
  const { userId } = req.user;
  const { deliveryPersonLocation, status } = req.body;

  const deliveryPerson = await DeliveryPartner.findById(userId);

  if (!deliveryPerson) {
    throw new apiError(404, "Delivery Person not found");
  }
  const order = await Order.findById(orderId);

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  if (["cancelled", "delivered"].includes(order.status)) {
    throw new apiError(404, "Order cannot be updated");
  }

  if (order.deliveryLocation.toString() !== userId) {
    throw new apiError(401, "Unauthorized");
  }

  order.status = status;
  order.deliveryPersonLocation = deliveryPersonLocation;
  await order.save()

  req.server.io.to(orderId).emit("liveTrackingUpdates", order)
  return reply
    .status(200)
    .send(new apiResponse(200, order, "order update success"));
  
})

const getOrders = asyncHandler(async (req, reply) => {
  const { status, customerId, deliveryPartnerId, branchId } = req.query;
  let query = {};
  if (status) {
    query.status = status;

  }
  if (customerId) {
    query.customer = customerId;
  }
  if (deliveryPartnerId) {
    query.deliveryPartner = deliveryPartnerId;
    query.branch = branchId;
  }

  const orders = await Order.find(query).populate("customer branch items.item deliveryPartner")
  return reply
    .status(200)
    .send(new apiResponse(200, orders, "order get success"));

})

const getOrderById = asyncHandler(async (req, reply) => {
  const { orderId } = req.params;
 

  const order = await Order.findById(orderId).populate(
    "customer branch items.item deliveryPartner"
  );
  return reply
    .status(200)
    .send(new apiResponse(200, order, "order get success"));
});

export {
  createOrder,
  confirmOrder,
  updateOrder,
  getOrders,
  getOrderById
}