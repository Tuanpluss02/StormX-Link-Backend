import mongoose from "mongoose";

export const UrlSchemas = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
});
