import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { NewUrlDTO } from './dto/new-url.dto';
import { UrlService } from './url.service';
import { UpdateUrlDTO } from './dto/update-url.dto';

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

    @Get('url/getAll')
    async getAllUrls() {
        return await this.urlService.getAllUrls();
    }

    @Patch('url/update/:id')
    async updateUrl(@Param('id') id: string, @Body() updateUrlDTO :UpdateUrlDTO) {
        return await this.urlService.updateUrl(id, updateUrlDTO);
    }
}
