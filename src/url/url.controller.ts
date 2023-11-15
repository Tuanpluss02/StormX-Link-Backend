import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Url } from './interfaces/url.interface';
import { InjectModel } from '@nestjs/mongoose';
import { NewUrlDTO } from './dto/new-url.dto';
import { UrlService } from './url.service';

@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) {}
    @Post('url/create')
    async createUrl(@Body() newUrlDTO: NewUrlDTO) {
       return await this.urlService.createUrl(newUrlDTO);
    }

    @Get(':urlCode(*)')
    async gotoUrl(@Param('urlCode') urlCode: string, @Res() res: Response) {
        const result =  await this.urlService.getLongUrl(urlCode);
        if(result.url){
            return res.redirect(result.url);
        }
        return res.status(404).json(result);
    }
}
