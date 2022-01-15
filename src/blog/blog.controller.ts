import { 
    Body, 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors, 
    Get, 
    Param, 
    Patch, 
    Delete, 
    UseGuards
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import {IBlog} from 'src/interface/interfaces';
import { JwtAuthGuard } from 'src/authorization/authorizations';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    // create a new blog
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog created successfully' })
    @Post('create-blog')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createBlog(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createBlogDto: CreateBlogDto):Promise<IBlog> {
        let imageIds: string[] = [];
        let videoIds: string[] = [];
        // get all image ids if images is not empty
        if(files?.images) {
            imageIds = files.images.map(image => image.id);
        }
        if(files?.videos) {
            // get all video ids
            videoIds = files.videos.map(video => video.id);
        }
        const {
            title,
            details,
            snippet,
            date,
            category,
        } = createBlogDto;
        // construct dto to create a new blog item
        const blogDto = {
            title,
            details,
            snippet,
            date,
            category,
            images: imageIds,
            videos: videoIds,
        }
        return await this.blogService.createBlog(blogDto);
    }

    // get all blogs
    @ApiOkResponse({ type: CreateBlogDto, isArray: true })
    @Get('get-blogs')
    async getBlogs():Promise<IBlog[]> {
        return await this.blogService.getBlogs();
    }

    // update a blog
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog updated successfully' })
    @Patch('update-blog/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async updateBlog(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createBlogDto: CreateBlogDto, @Param('id') id: string):Promise<IBlog> {
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
            title,
            details,
            snippet,
            date,
            category,
        } = createBlogDto;
        // construct dto to create a new blog item
        const blogDto = {
            title,
            details,
            snippet,
            date,
            category,
            images: imageIds,
            videos: videoIds,
        }
        return await this.blogService.updateBlog(id, blogDto);
    }

    // find blog by id
    @ApiOkResponse({ type: CreateBlogDto, isArray: false })
    @Get('find-blog-by-id/:id')
    async findBlogById(@Param('id') id: string):Promise<IBlog> {
        return await this.blogService.findBlogById(id);
    }

    // find blog by title
    @ApiOkResponse({ type: CreateBlogDto, isArray: false })
    @Get('find-blog-by-title/:title')
    async findBlogByTitle(@Param('title') title: string):Promise<IBlog> {
        return await this.blogService.findBlogByTitle(title);
    }

    // delete a blog
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog deleted successfully' })
    @Delete('delete-blog/:id')
    async deleteBlog(@Param('id') id: string):Promise<boolean> {
        return await this.blogService.deleteBlog(id);
    }
}
