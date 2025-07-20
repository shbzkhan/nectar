import mongoose,{Schema} from "mongoose";
import { Counter } from "./counter.models.js";

const orderSchema = new Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  deliveryPartner: {
    type: Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },

  items: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      item: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        },
        count: {
            type: Number,
            required: true
      }
    },
    ],
    deliveryLocation:{
        latitude: {
            type:Number
        },
        longitute: {
            type:Number
        },
        address:{
            type: String
        }
    },
    pickupLocation:{
        latitude: {
            type:Number
        },
        longitute: {
            type:Number
        },
        address:{
            type: String
        }
    },
    deliveryPersonLocation:{
        latitude: {
            type:Number
        },
        longitute: {
            type:Number
        },
        address:{
            type: String
        }
    },
    status: {
        type: String,
        enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
        default:"available"
    }
},{timestamps: true});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        {new:true, upsert: true}
    )
    return sequenceDocument.sequence_value
}

orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORDR${sequenceValue.toString().padStart(5, "0")}`
    }
    next()
})
export const Order = mongoose.model("Order", orderSchema )