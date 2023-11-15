import { HttpException, HttpStatus, Injectable, NotFoundException, Redirect } from "@nestjs/common";
import { Model } from "mongoose";
import { Url } from "../../entities/url.entity";
import { InjectModel } from "@nestjs/mongoose";
import { NewUrlDTO } from "./dto/new-url.dto";
import * as crypto from 'crypto';
import { UpdateUrlDTO } from "./dto/update-url.dto";
import { iResponse } from "src/utilities/responseHandle";

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async createUrl(newUrlDTO: NewUrlDTO) {
    try {
      let urlCode = newUrlDTO.urlCode;
      if(urlCode){
        const isAvailable = await this.urlModel.findOne({urlCode: newUrlDTO.urlCode});
      if(isAvailable){
        return new HttpException('URL Code is already taken!', HttpStatus.BAD_REQUEST);
      }
      }else{
        urlCode = crypto.randomBytes(8).toString("hex");
      }
      const newUrl = new this.urlModel({...newUrlDTO, urlCode: urlCode});
      await newUrl.save();
      return iResponse(HttpStatus.OK, "URL Created Successfully!", newUrl)
    } catch (error) {
      return iResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error)
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
      throw iResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error)
    }
  }
  async getAllUrls() {
    try {
      const urls = await this.urlModel.find();
      return urls;
    } catch (error) {
      throw iResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error)
    }
  }

  async deteleUrl(id: string) {
    try{
      const url = await this.urlModel.findById(id);
      if(!url){
        return new NotFoundException('URL not found.');
      }
      await this.urlModel.deleteOne({_id: id});
      return iResponse(HttpStatus.OK, "URL Deleted Successfully!")
    } catch (error) {
      throw iResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error)
    }
  }

  async updateUrl(id: string, updateUrlDTO :UpdateUrlDTO) {
    try {
      const existingUrl = await this.urlModel.findById(id);
      if(!existingUrl){
        return new NotFoundException('URL not found.');
      }

    if (!updateUrlDTO.newUrlCode) {
      existingUrl.urlCode = crypto.randomBytes(8).toString("hex");
    }else {
      const isUnavailable = await this.urlModel.findOne({urlCode: updateUrlDTO.newUrlCode});
      if(isUnavailable){
        return iResponse(HttpStatus.BAD_REQUEST, "URL Code is already taken!")
      }
      existingUrl.urlCode = updateUrlDTO.newUrlCode;
    }
    if (updateUrlDTO.newLongUrl) {
      existingUrl.longUrl = updateUrlDTO.newLongUrl;
    }
    await existingUrl.save();
    return 
    } catch (error) {
      return iResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!", error)
    }
  }
}
