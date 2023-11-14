import mongoose from "mongoose";

export const UrlSchema = new mongoose.Schema({
  longUrl: String,
  urlCode: String,
});
