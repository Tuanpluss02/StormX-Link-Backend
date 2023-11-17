import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true})
export class Url extends mongoose.Document {
  @Prop({ required: true})
  longUrl: string;

  @Prop({ required: true, unique: true, message: "Url Code must be uniuqe", index: true})
  urlCode: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);