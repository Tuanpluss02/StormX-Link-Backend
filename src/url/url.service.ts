import { Injectable, Redirect } from "@nestjs/common";
import { Model } from "mongoose";
import { Url } from "./interfaces/url.interface";
import { InjectModel } from "@nestjs/mongoose";
import { NewUrlDTO } from "./dto/new-url.dto";
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  constructor(@InjectModel("URL") private readonly urlModel: Model<Url>) {}

  async createUrl(newUrlDTO: NewUrlDTO) {
    try {
      let urlCode = newUrlDTO.urlCode;
      if(urlCode){
        const isAvailable = await this.urlModel.findOne({urlCode: newUrlDTO.urlCode});
      if(isAvailable){
        return {
          message: "URL Code is already taken!",
        }
      }
      }else{
        urlCode = crypto.randomBytes(8).toString("hex");
      }
      const newUrl = new this.urlModel({...newUrlDTO, urlCode: urlCode});
      await newUrl.save();
      return {
        message: "URL Created Successfully!",
        url: newUrl,
      };
    } catch (error) {
      return {
        message: "Something went wrong!",
        errors: error,
      }
    }
  }
  async getLongUrl(urlCode: string) {
    try {
      const url = await this.urlModel.findOne({ urlCode });

      if (!url) {
        return {
          message: 'Invalid URL',
        };
      }
      return { url: url.longUrl };
    } catch (error) {
      return {
        message: 'Something went wrong!',
        errors: error,
      };
    }
  }
}
