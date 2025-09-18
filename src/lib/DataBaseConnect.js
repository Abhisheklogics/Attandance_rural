import mongoose from "mongoose";

let isConnected = false; 

export default async function connectToDb() {
  if (isConnected) {
    
    console.log("⚡ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;

    console.log(" Database connected");
    console.log("Host:", conn.connection.host);
  } catch (error) {
    console.error(" Database connection failed:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
