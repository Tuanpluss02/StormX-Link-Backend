import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { User } from "src/entities/user.entity";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UpdateUserPasswordDTO } from "./dto/update-password.dto";
import { UserService } from "./user.service";

@Controller("api/v1/user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User information retrieved successfully",
    type: User,
  })
  async getMe(@Req() request: Request): Promise<{
    statusCode: number;
    message: string;
    data: User;
  }> {
    const userId = request.user["id"];
    const user = await this.userService.getUserById(userId);
    return {
      statusCode: HttpStatus.OK,
      message: "User retrieval successful",
      data: user,
    };
  }

  @Post("/changePassword")
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password changed successfully",
  })
  async changePassword(
    @Body() updateUserPasswordDTO: UpdateUserPasswordDTO,
    @Req() request: Request,
  ): Promise<{
    statusCode: number;
    message: string;
    data: { message: string };
  }> {
    const userId = request.user["id"];
    const result = await this.userService.changePassword(
      userId,
      updateUserPasswordDTO.oldPassword,
      updateUserPasswordDTO.newPassword,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Password change successful",
      data: result,
    };
  }
}
