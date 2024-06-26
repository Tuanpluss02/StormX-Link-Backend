import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
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
