import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Url } from './url.entity';


@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, index: true})
  username: string;

  @Prop({required: true})
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' }] })
  urls: Url[];
}

export const UserSchema = SchemaFactory.createForClass(User);
