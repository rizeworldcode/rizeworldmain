const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });
    if (conn) {
        console.log("Database connected successfully");
    }
    else{
        console.log("Database connection failed!");
    }
  } catch (error) {
    console.log("Database connection failed! ", error);
  }
};