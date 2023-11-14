import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Url } from "./interfaces/url.interface";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UrlService {
  constructor(@InjectModel("URL") private readonly urlModel: Model<Url>) {}

  async createUrl(longUrl: string, shortUrl: string) {
    try {
      const newUrl = new this.urlModel({
        longUrl,
        shortUrl,
      });
      await newUrl.save();
      return newUrl;
    } catch (error) {
      return {
        message: "Something went wrong",
        error: error,
      };
    }
  }
}
