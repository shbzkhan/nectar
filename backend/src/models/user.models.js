import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type:String
    },
    role: {
        type: String,
        enum:["Customer", "Admin", "DeliveryPartner"],
        required :true,
    },
    isActivated: {
        type: Boolean,
        default:false
    }


})

const customerSchema = new Schema({
    ...userSchema.obj,
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ["Customer"],
        default:"Customer"
    },
    liveLocation: {
        latitude: {
            type:Number
        },
        longitute: {
            type:Number
        }
    },
    address: {
        type:String
    }
}, { timestamps: true })

//delivery partner

const deliveryPartnerSchema = new Schema({
  ...userSchema.obj,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["DeliveryPartner"],
    default: "DeliveryPartner",
  },
  liveLocation: {
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
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
});

deliveryPartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

deliveryPartnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//admin Schema
const adminSchema = new Schema({
  ...userSchema.obj,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    },
    role: {
        type: String,
        enum: ["Admin"],
        default: "Admin"
  }
})
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


export const Customer = mongoose.model("Customer", customerSchema) 
export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema) 
export const Admin = mongoose.model("Admin", adminSchema) 