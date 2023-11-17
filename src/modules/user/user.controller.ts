import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Response, Request } from "express";
import { UserService } from './user.service';
import { iResponse } from 'src/utilities/responseHandle';



@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }
    @Get('/me')
    @UseGuards(JwtGuard)
    async getMe(@Req() request: Request ,@Res() response: Response) {
        const userid = request.user['id'];
        const user = await this.userService.getUserById(userid);
        return iResponse(response, HttpStatus.OK, "Get user success", user);
    }

    
}
