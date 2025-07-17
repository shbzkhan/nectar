import { Customer, DeliveryPartner } from "../models/index.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const loginCustomer = asyncHandler(async (req, reply) => {
  const { phone } = req.body;
  let customer = await Customer.findOne({ phone });
  if (!customer) {
    customer = new Customer({
      phone,
      role: "Customer",
      isActivated: true,
    });
    await customer.save();
  }

  const { accessToken, refreshToken } = generateTokens(customer);

  return reply.status(200).send(
    new apiResponse(
      200,
      {
        user: customer,
        accessToken,
        refreshToken,
      },
      "Login Succesfully"
    )
  );
});

const loginDeliveryPartner = asyncHandler(async (req, reply) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(400, "all fields are required");
  }

  const deliveryPartner = await DeliveryPartner.findOne({ email });
  if (!deliveryPartner) {
    throw new apiError(404, "Invalid Credentials");
  }
  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new apiError(405, "password is incorrect");
  }
  const { accessToken, refreshToken } = generateTokens(deliveryPartner);

  return reply.status(200).json(
    new apiResponse(
      200,
      {
        user: deliveryPartner,
        accessToken,
        refreshToken,
      },
      "Login Sucessfully"
    )
  );
});

// refresh token
const refreshAccessToken = asyncHandler(async (req, reply) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new apiError(401, "Refresh token required");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  let user;
  if (decoded.role === "Customer") {
    user = await Customer.findById(decoded.userId);
  } else if (decoded.role === "DeliveryPartner") {
    user = await DeliveryPartner.findById(decoded.userId);
  } else {
    throw new apiError(403, "Inavlid Role");
  }

  if (!user) {
    throw new apiError(404, "User not found");
  }

  const { accessToken, newRefreshToken } = generateTokens(user);

  return reply.status(200).send(
    new apiResponse(
      200,
      {
        accessToken,
        newRefreshToken,
      },
      "Inavild Refresh Token"
    )
  );
});

const fetchUser = asyncHandler(async (req, reply) => {
  const { userId, role } = req.user;
  let user;

  if (role === "Customer") {
    user = await Customer.findById(userId);
  } else if (role === "DeliveryPartner") {
    user = await DeliveryPartner.findById(userId).select("-password");
  } else {
    throw new apiError(403, "Inavlid Role");
  }

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return reply
    .status(200)
    .send(new apiResponse(200, user, "user fetch successfully"));
});

const updateUser = asyncHandler(async (req, reply) => {
  const { userId } = req.user;
  const updateData = req.body;
  let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

  if (!user) {
    throw new apiError(404, "user not found")
  }

  let UserModel;
  if (user.role === "Customer") {
    UserModel = Customer
  }else if (user.role === "DeliveryPartner") {
    UserModel = DeliveryPartner;
  } else {
    throw new apiError(404, "Invalid user role")
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true}
  )

  if (!updatedUser) {
    throw new apiError(404, "User not found")
  }

  return reply.status(200).send(
    new apiResponse(200, {user:updatedUser}, "User updated successfully")
  )
})

export {
  loginCustomer,
  loginDeliveryPartner,
  refreshAccessToken,
  fetchUser,
  updateUser,
};