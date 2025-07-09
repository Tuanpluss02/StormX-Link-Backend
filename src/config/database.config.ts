import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  return {
    uri: configService.get<string>("MONGO_URI"),
    dbName: configService.get<string>("MONGO_DB_NAME"),
    // Connection pooling for high concurrency
    maxPoolSize: 100, // Maximum number of connections in the pool
    minPoolSize: 5, // Minimum number of connections in the pool
    maxIdleTimeMS: 300000, // Close connections after 5 minutes of inactivity
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a socket
    family: 4, // Use IPv4, skip trying IPv6
    // Buffer commands when connection is lost
    bufferCommands: false,
    // Enable retryable reads and writes
    retryReads: true,
    retryWrites: true,
    // Index creation options
    autoIndex: process.env.NODE_ENV !== "production", // Disable in production
    autoCreate: false, // Don't auto-create collections
  };
};
