import { Body, Controller, Post, UseInterceptors, UploadedFiles, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import INews from '../interface/news.interface';
import { CreateNewsDto } from './dto/news.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    // create a new news
    @Post('create-news')
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createNews(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createNewsDto: CreateNewsDto): Promise<INews> {
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
        return await this.newsService.createNews(newsDto);
    }

    // get all news
    @Get('get-all-news')
    @ApiOkResponse({ type: CreateNewsDto, isArray: true, description: 'All news' })
    async getAllNews(): Promise<INews[]> {
        return await this.newsService.getAllNews();
    }

    // find news by id
    @Get('find-news/:id')
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News found successfully' })
    async findNewsById(@Param('id') id: string): Promise<INews> {
        return await this.newsService.findNewsById(id);
    }

    // find news by title
    @Get('find-news/:title')
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News found successfully' })
    async findNewsByTitle(@Param('title') title: string): Promise<INews> {
        return await this.newsService.findNewsByTitle(title);
    }

    // update news by id
    @Post('update-news/:id')
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News updated successfully' })
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
    @Post('delete-news/:id')
    @ApiOkResponse({ type: CreateNewsDto, isArray: false, description: 'News deleted successfully' })
    async deleteNews(@Param('id') id: string): Promise<boolean> {
        return await this.newsService.deleteNews(id);
    }
}
