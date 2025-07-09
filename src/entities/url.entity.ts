import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
  collection: "urls",
})
export class Url extends mongoose.Document {
  @Prop({ required: true })
  longUrl: string;

  @Prop({
    required: true,
    unique: true,
    message: "Url Code must be unique",
    index: true,
  })
  urlCode: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  clickCount: number;

  @Prop({ default: Date.now })
  lastAccessed: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

// Add compound indexes for better performance
UrlSchema.index({ urlCode: 1, userId: 1 });
UrlSchema.index({ userId: 1, createdAt: -1 });
UrlSchema.index({ createdAt: -1 });
UrlSchema.index({ clickCount: -1 });
