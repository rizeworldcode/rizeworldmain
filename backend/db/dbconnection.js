const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

// MongoDB Connection Pool Configuration
const poolOptions = {
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 50, // Maintain up to 50 concurrent socket connections
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE, 10) || 10, // Maintain at least 10 warm connections to avoid handshake latency
  maxIdleTimeMS: 30000, // Close sockets idle for more than 30 seconds
  serverSelectionTimeoutMS: 10000, // Fail fast if MongoDB cluster is unreachable
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of query inactivity
  connectTimeoutMS: 10000, // Abort initial connection after 10 seconds
  heartbeatFrequencyMS: 10000, // Monitor cluster health every 10 seconds
};

// Lifecycle Event Listeners for Connection Pool Monitoring
mongoose.connection.on("connected", () => {
  console.log("✓ MongoDB connection pool established successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("✗ MongoDB connection pool error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("! MongoDB disconnected. Connection pool handling automatic reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("✓ MongoDB connection pool reconnected successfully");
});

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, poolOptions);
    return conn;
  } catch (error) {
    console.error("✗ Database initial connection failed:", error.message);
  }
};