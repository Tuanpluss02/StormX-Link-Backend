import mongoose, { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
  collection: "users",
})
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
    ondelete: "CASCADE",
  })
  urls: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add compound indexes for better performance
UserSchema.index({ username: 1, createdAt: -1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ urls: 1 });
