import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("DB connected")
    } catch (error) {
        console.log("Database connection error: ", error)
        process.exit(1);
    }
}