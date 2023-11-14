import mongoose from "mongoose";

export const UserSchemas = new mongoose.Schema({
  username: String,
  password: String,
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
});
