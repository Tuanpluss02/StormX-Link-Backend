import { Document } from "mongoose";
import { Url } from "src/url/interfaces/url.interface";

export interface User extends Document {
  username: string;
  password: string;
  urls?: Url[];
}
