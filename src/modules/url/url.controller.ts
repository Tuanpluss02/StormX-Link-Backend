import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response,Request, response } from "express";
import { NewUrlDTO } from "./dto/new-url.dto";
import { UrlService } from "./url.service";
import { UpdateUrlDTO } from "./dto/update-url.dto";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { AppConfig } from "../../common/config/configuration";
import { UserService } from "../user/user.service";
import { iResponse } from "src/utilities/responseHandle";
import { request } from "http";

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly appconfig: AppConfig,
    private readonly userService: UserService,
  ) { }

  @Post("api/v1/url/create")
  @UseGuards(JwtGuard)
  async createUrl(@Body() newUrlDTO: NewUrlDTO,@Req()request: Request, @Res() response: Response) {
    const newUrl = await this.urlService.createUrl(newUrlDTO);
    const userId = request.user['id'];
    const user = await this.userService.getUserById(userId);
    user.urls.push(newUrl.id);
    await user.save();
    return iResponse(response, HttpStatus.OK, "Create url success", newUrl);

  }

  @Get(":urlCode")
  async gotoUrl(@Param("urlCode") urlCode: string, @Res() res: Response) {
    if (!urlCode) {
      return res.redirect(this.appconfig.getFrontendUrl());
    }
    const result = await this.urlService.getLongUrl(urlCode);
    if (result.url) {
      return res.redirect(result.url);
    }
    return new HttpException("Url not found", HttpStatus.NOT_FOUND);
  }

  @Get('api/v1/url/getAll')
  @UseGuards(JwtGuard)
  async getAllUrls(@Req()request: Request, @Res() response: Response) {
    const userId = request.user['id'];
    const allUserUrl = await this.userService.getAllUrls(userId);
    return iResponse(response, HttpStatus.OK, "Get all urls success", allUserUrl);
  }

  @Patch('api/v1/url/update/:id')
  @UseGuards(JwtGuard)
  async updateUrl(@Param('id') id: string, @Body() updateUrlDTO :UpdateUrlDTO, @Req()request: Request, @Res() response: Response) {
    const userId = request.user['id'];
    const allUserUrl = await this.userService.getAllUrls(userId);
    const isUrlExist = allUserUrl.find(url => url._id.toString() === id);
    if (!isUrlExist) {
      return iResponse(response, HttpStatus.NOT_FOUND, "Url not found");
    }
    const result = await this.urlService.updateUrl(id, updateUrlDTO);
    return iResponse(response, HttpStatus.OK, "Update url success", result);
  }
  
  @Delete('api/v1/url/delete/:id')
  @UseGuards(JwtGuard)
  async deleteUrl(@Param('id') id: string, @Req() request : Request, @Res() response: Response) {
    const userId = request.user['id'];
    const allUserUrl = await this.userService.getAllUrls(userId);
    const isUrlExist = allUserUrl.find(url => url._id.toString() === id);
    if (!isUrlExist) {
      return iResponse(response, HttpStatus.NOT_FOUND, "Url not found");
    }
    await this.urlService.deteleUrl(id);
    const user = await this.userService.getUserById(userId);
    user.urls = user.urls.filter(url => url.toString() !== id);
    await user.save();
    return iResponse(response, HttpStatus.OK, "Delete url success");
  }
}
