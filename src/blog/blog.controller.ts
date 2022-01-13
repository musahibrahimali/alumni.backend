import { Body, Controller, Post, UploadedFiles, UseInterceptors, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import IBlog from '../interface/blog.interface';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    // create a new blog
    @Post('create-blog')
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createBlog(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createBlogDto: CreateBlogDto):Promise<IBlog> {
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
            title: blogTitle,
            details: blogDescription,
            snippet: blogSnippet,
            date: blogDate,
            category: blogCategory,
        } = createBlogDto;
        // construct dto to create a new blog item
        const blogDto = {
            title: blogTitle,
            details: blogDescription,
            snippet: blogSnippet,
            date: blogDate,
            category: blogCategory,
            images: imageIds,
            videos: videoIds,
        }
        return await this.blogService.createBlog(blogDto);
    }

    // get all blogs
    @Get('get-blogs')
    @ApiOkResponse({ type: CreateBlogDto, isArray: true })
    async getBlogs():Promise<IBlog[]> {
        return await this.blogService.getBlogs();
    }

    // update a blog
    @Patch('update-blog/:id')
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog updated successfully' })
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
            title: blogTitle,
            details: blogDescription,
            snippet: blogSnippet,
            date: blogDate,
            category: blogCategory,
        } = createBlogDto;
        // construct dto to create a new blog item
        const blogDto = {
            title: blogTitle,
            details: blogDescription,
            snippet: blogSnippet,
            date: blogDate,
            category: blogCategory,
            images: imageIds,
            videos: videoIds,
        }
        return await this.blogService.updateBlog(id, blogDto);
    }

    // find blog by id
    @Get('find-blog-by-id/:id')
    @ApiOkResponse({ type: CreateBlogDto, isArray: false })
    async findBlogById(@Param('id') id: string):Promise<IBlog> {
        return await this.blogService.findBlogById(id);
    }

    // find blog by title
    @Get('find-blog-by-title/:title')
    @ApiOkResponse({ type: CreateBlogDto, isArray: false })
    async findBlogByTitle(@Param('title') title: string):Promise<IBlog> {
        return await this.blogService.findBlogByTitle(title);
    }

    // delete a blog
    @Delete('delete-blog/:id')
    @ApiOkResponse({ type: CreateBlogDto, isArray: false, description: 'Blog deleted successfully' })
    async deleteBlog(@Param('id') id: string):Promise<boolean> {
        return await this.blogService.deleteBlog(id);
    }
}
