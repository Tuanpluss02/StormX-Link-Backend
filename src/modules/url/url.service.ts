import { Injectable, NotFoundException, Redirect } from "@nestjs/common";
import { Model } from "mongoose";
import { Url } from "../../entities/url.entity";
import { InjectModel } from "@nestjs/mongoose";
import { NewUrlDTO } from "./dto/new-url.dto";
import * as crypto from 'crypto';
import { UpdateUrlDTO } from "./dto/update-url.dto";

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
        throw new NotFoundException('No users found.');
      }
      return { url: url.longUrl };
    } catch (error) {
      return {
        message: 'Something went wrong!',
        errors: error,
      };
    }
  }
  async getAllUrls() {
    try {
      const urls = await this.urlModel.find();
      return urls;
    } catch (error) {
      return {
        message: "Something went wrong!",
        errors: error,
      }
    }
  }

  async deteleUrl(urlCode: string) {
    try{
      const url = await this.urlModel.findOne({urlCode});
      if(!url){
        return {
          message: "Invalid URL",
        }
      }
      await this.urlModel.deleteOne({urlCode});
      return {
        message: "URL Deleted Successfully!",
      }
    } catch (error) {
      return {
        message: "Something went wrong!",
        errors: error,
      }
    }
  }

  async updateUrl(id: string, updateUrlDTO :UpdateUrlDTO) {
    try {
      const existingUrl = await this.urlModel.findById(id);
      if(!existingUrl){
        return {
          message: "Invalid ID",
        }
      }

    if (!updateUrlDTO.newUrlCode) {
      existingUrl.urlCode = crypto.randomBytes(8).toString("hex");
    }else {
      const isUnavailable = await this.urlModel.findOne({urlCode: updateUrlDTO.newUrlCode});
      if(isUnavailable){
        return {
          message: "URL Code is already taken!",
        }
      }
      existingUrl.urlCode = updateUrlDTO.newUrlCode;
    }
    if (updateUrlDTO.newLongUrl) {
      existingUrl.longUrl = updateUrlDTO.newLongUrl;
    }
    await existingUrl.save();
    return {
      message: "URL Updated Successfully!",
      url: existingUrl,};
    } catch (error) {
      return {
        message: "Something went wrong!",
        errors: error,
      }
    }
  }
}
