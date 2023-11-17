import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from "express";
import { UserService } from './user.service';
import { iResponse } from 'src/utilities/responseHandle';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserPasswordDTO } from './dto/update-password.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';



@Controller('api/v1/user')
@ApiTags("User")
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('/me')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    async getMe(@Req() request: Request ,@Res() response: Response) {
        const userid = request.user['id'];
        const user = await this.userService.getUserById(userid);
        return iResponse(response, HttpStatus.OK, "User retrieval successful.", user);
    }

    @Post('/changePassword')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    async changePassword(@Body() updateUserPasswordDTO: UpdateUserPasswordDTO,@Req() request: Request, @Res() response: Response) {
        const userid = request.user['id'];
        await this.userService.changePassword(userid,updateUserPasswordDTO.oldPassword,updateUserPasswordDTO.newPassword);
        return iResponse(response, HttpStatus.OK, "Password change successful.");
    }
    
}
