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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { iResponse } from "src/utils/responseHandle";
import { UserService } from "../user/user.service";
import { NewUrlDTO } from "./dto/new-url.dto";
import { UpdateUrlDTO } from "./dto/update-url.dto";
import { UrlService } from "./url.service";

@Controller()
@ApiTags("URL")
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService,
  ) {}

  @Post("api/v1/url/create")
  @ApiBearerAuth()
  @ApiBody({ type: NewUrlDTO })
  @UseGuards(JwtGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  async createUrl(
    @Body() newUrlDTO: NewUrlDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const newUrl = await this.urlService.createUrl(newUrlDTO);
    const userId = request.user["id"];
    const user = await this.userService.getUserById(userId);
    user.urls.push(newUrl.id);
    await user.save();
    return iResponse(
      response,
      HttpStatus.OK,
      "URL creation successful.",
      newUrl,
    );
  }

  @Get(":urlCode")
  async gotoUrl(@Param("urlCode") urlCode: string, @Res() res: Response) {
    if (!urlCode) {
      return res.redirect(process.env.FRONTEND_URL);
    }
    const result = await this.urlService.getLongUrl(urlCode);
    if (result.url) {
      return res.redirect(result.url);
    }
    throw new HttpException("URL not found", HttpStatus.NOT_FOUND);
  }

  @Get("api/v1/url/getAll")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiConsumes("application/x-www-form-urlencoded")
  async getAllUrls(@Req() request: Request, @Res() response: Response) {
    const userId = request.user["id"];
    const allUserUrl = await this.userService.getAllUrls(userId);
    allUserUrl.reverse();
    return iResponse(
      response,
      HttpStatus.OK,
      "Retrieving all URLs successful.",
      allUserUrl,
    );
  }

  @Patch("api/v1/url/update/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUrlDTO })
  @ApiConsumes("application/x-www-form-urlencoded")
  async updateUrl(
    @Param("id") id: string,
    @Body() updateUrlDTO: UpdateUrlDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const userId = request.user["id"];
    const allUserUrl = await this.userService.getAllUrls(userId);
    const isUrlExist = allUserUrl.find((url) => url._id.toString() === id);
    if (!isUrlExist) {
      throw new HttpException("URL not found", HttpStatus.NOT_FOUND);
    }
    const result = await this.urlService.updateUrl(id, updateUrlDTO);
    return iResponse(response, HttpStatus.OK, "URL update successful.", result);
  }

  @Delete("api/v1/url/delete/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiConsumes("application/x-www-form-urlencoded")
  async deleteUrl(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const userId = request.user["id"];
    const user = await this.userService.getUserById(userId);
    const isUrlExist = user.urls.find((url) => url.toString() === id);
    if (!isUrlExist) {
      throw new HttpException("URL not found", HttpStatus.NOT_FOUND);
    }
    await this.urlService.deteleUrl(id);
    user.urls = user.urls.filter((url) => url.toString() !== id);
    await user.save();
    return iResponse(response, HttpStatus.OK, "URL deletion successful.");
  }
}
