import { Body, Controller, Post, UseInterceptors, UploadedFiles, Get, Param, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import {INews} from 'src/interface/interfaces';
import { CreateNewsDto } from './dto/news.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authorization/authorizations';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    // create a new news
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News created successfully' })
    @Post('create-news')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createNews(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createNewsDto: CreateNewsDto): Promise<INews> {
        let imageIds: string[] = [];
        let videoIds: string[] = [];
        // get all image ids if images is not empty
        if(files.images) {
            imageIds = files.images.map(image => image.id);
        }
        if(files.videos) {
            // get all video ids
            videoIds = files.videos.map(video => video.id);
        }
        const {
            title:newsTitle, 
            details:newsDescription,
            snippet:newsSnippet, 
        } = createNewsDto;
        const newsDto = {
            title:newsTitle, 
            details:newsDescription,
            snippet:newsSnippet,
            images: imageIds,
            videos: videoIds,
        }
        return await this.newsService.createNews(newsDto);
    }

    // get all news
    @ApiOkResponse({ type: CreateNewsDto, isArray: true, description: 'All news' })
    @Get('get-all-news')
    async getAllNews(): Promise<INews[]> {
        return await this.newsService.getAllNews();
    }

    // find news by id
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News found successfully' })
    @Get('find-news/:id')
    async findNewsById(@Param('id') id: string): Promise<INews> {
        return await this.newsService.findNewsById(id);
    }

    // find news by title
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News found successfully' })
    @Get('find-news/:title')
    async findNewsByTitle(@Param('title') title: string): Promise<INews> {
        return await this.newsService.findNewsByTitle(title);
    }

    // update news by id
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News updated successfully' })
    @Post('update-news/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async updateNews(@Param('id') id: string, @UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createNewsDto: CreateNewsDto): Promise<INews> {
        // get all image ids
        const imageIds = files.images.map(image => image.id);
        const videosIds = files.videos.map(video => video.id);
        const {
            title:newsTitle, 
            details:newsDescription,
            snippet:newsSnippet, 
        } = createNewsDto;
        const newsDto = {
            title:newsTitle, 
            details:newsDescription,
            snippet:newsSnippet,
            images: imageIds,
            videos: videosIds,
        }
        return await this.newsService.updateNews(id, newsDto);
    }

    // delete news by id
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News deleted successfully' })
    @Post('delete-news/:id')
    async deleteNews(@Param('id') id: string): Promise<boolean> {
        return await this.newsService.deleteNews(id);
    }
}
