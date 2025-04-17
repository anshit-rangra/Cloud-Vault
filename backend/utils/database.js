import mongoose from "mongoose";

const connectDB = async() => {
   return  await mongoose.connect(process.env.DATABASE_URL)
}

export default connectDB