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
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { NewUrlDTO } from "./dto/new-url.dto";
import { UrlService } from "./url.service";
import { UpdateUrlDTO } from "./dto/update-url.dto";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { AppConfig } from "../../common/config/configuration";

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly appconfig: AppConfig,
  ) { }

  @Post("api/v1/url/create")
  @UseGuards(JwtGuard)
  async createUrl(@Body() newUrlDTO: NewUrlDTO, response: Response) {
    const ressult = await this.urlService.createUrl(newUrlDTO);
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

  // @Get('api/v1/url/getAll')
  // @UseGuards(JwtAuthGuard)
  // async getAllUrls() {
  //     return await this.urlService.getAllUrls();
  // }

  // @Patch('api/v1/url/update/:id')
  // @UseGuards(JwtAuthGuard)
  // async updateUrl(@Param('id') id: string, @Body() updateUrlDTO :UpdateUrlDTO) {
  //     return await this.urlService.updateUrl(id, updateUrlDTO);
  // }
  // @Delete('api/v1/url/delete/:id')
  // @UseGuards(JwtAuthGuard)
  // async deleteUrl(@Param('id') id: string) {
  //     return await this.urlService.deteleUrl(id);
  // }
}
