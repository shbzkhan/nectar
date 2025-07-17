import mongoose,{ Schema } from "mongoose";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    location: {
      latitude: {
        type: Number,
      },
      longitute: {
        type: Number,
      },
    },
    address: {
      type: String,
        },
        DeliveryPartners: [{
            type: Schema.Types.ObjectId,
            ref:'DeliveryPartner'
    }]
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", branchSchema)