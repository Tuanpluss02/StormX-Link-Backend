import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import { Model } from "mongoose";
import { genUrlCode } from "src/utils/urlCodeGenerator";
import { Url } from "../../entities/url.entity";
import { NewUrlDTO } from "./dto/new-url.dto";
import { UpdateUrlDTO } from "./dto/update-url.dto";

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async createUrl(newUrlDTO: NewUrlDTO): Promise<Url> {
    try {
      let urlCode = newUrlDTO.urlCode || genUrlCode();
      const isAvailable = await this.urlModel.findOne({
        urlCode: newUrlDTO.urlCode,
      });
      if (isAvailable) {
        throw new HttpException(
          "URL Code is already taken!",
          HttpStatus.BAD_REQUEST,
        );
      }
      const newUrl = new this.urlModel({ ...newUrlDTO, urlCode: urlCode });
      return await newUrl.save();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLongUrl(urlCode: string): Promise<{ url: string }> {
    try {
      const url = await this.urlModel.findOne({ urlCode });
      if (!url) {
        throw new NotFoundException("URL not found.");
      }
      return { url: url.longUrl };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllUrls(): Promise<Url[]> {
    try {
      const urls = await this.urlModel.find();
      return urls;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deteleUrl(id: string): Promise<void> {
    try {
      await this.urlModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUrl(id: string, updateUrlDTO: UpdateUrlDTO): Promise<Url> {
    try {
      const existingUrl = await this.urlModel.findById(id);
      if (!existingUrl) {
        throw new NotFoundException("URL not found.");
      }
      existingUrl.urlCode =
        updateUrlDTO.newUrlCode || crypto.randomBytes(8).toString("hex");
      existingUrl.longUrl = updateUrlDTO.newLongUrl || existingUrl.longUrl;
      return await existingUrl.save();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
