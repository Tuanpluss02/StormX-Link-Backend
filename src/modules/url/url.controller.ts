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
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import {
  PaginationDto,
  PaginatedResponse,
} from "src/common/dto/pagination.dto";
import { Url } from "src/entities/url.entity";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { UserService } from "../user/user.service";
import { NewUrlDTO } from "./dto/new-url.dto";
import { PaginatedUrlResponseDto } from "./dto/paginated-url-response.dto";
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "URL created successfully",
    type: Url,
  })
  async createUrl(
    @Body() newUrlDTO: NewUrlDTO,
    @Req() request: Request,
  ): Promise<{
    statusCode: number;
    message: string;
    data: Url;
  }> {
    const userId = request.user["id"];
    const newUrl = await this.urlService.createUrl(newUrlDTO, userId);
    const user = await this.userService.getUserById(userId);
    user.urls.push(newUrl.id);
    await user.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: "URL creation successful",
      data: newUrl,
    };
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "URLs retrieved successfully",
    type: PaginatedUrlResponseDto,
  })
  async getAllUrls(
    @Req() request: Request,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    statusCode: number;
    message: string;
    data: PaginatedResponse<Url>;
  }> {
    const userId = request.user["id"];
    const result = await this.urlService.getUrlsByUserId(userId, paginationDto);
    return {
      statusCode: HttpStatus.OK,
      message: "Retrieving all URLs successful",
      data: result,
    };
  }

  @Patch("api/v1/url/update/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUrlDTO })
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "URL updated successfully",
    type: Url,
  })
  async updateUrl(
    @Param("id") id: string,
    @Body() updateUrlDTO: UpdateUrlDTO,
    @Req() request: Request,
  ): Promise<{
    statusCode: number;
    message: string;
    data: Url;
  }> {
    const userId = request.user["id"];
    const result = await this.urlService.updateUrl(id, updateUrlDTO, userId);
    return {
      statusCode: HttpStatus.OK,
      message: "URL update successful",
      data: result,
    };
  }

  @Delete("api/v1/url/delete/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "URL deleted successfully",
  })
  async deleteUrl(
    @Param("id") id: string,
    @Req() request: Request,
  ): Promise<{
    statusCode: number;
    message: string;
  }> {
    const userId = request.user["id"];
    await this.urlService.deleteUrl(id, userId);
    const user = await this.userService.getUserById(userId);
    user.urls = user.urls.filter((url) => url.toString() !== id);
    await user.save();
    return {
      statusCode: HttpStatus.OK,
      message: "URL deletion successful",
    };
  }
}
