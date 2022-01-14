import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Model, Connection } from 'mongoose';
import {IBlog} from 'src/interface/interfaces';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog, BlogModel } from './schemas/blog.schema';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class BlogService {
    private fileModel: MongoGridFS;
    
    constructor(
        @InjectModel(Blog.name) private blogModel:Model<BlogModel>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'blogMedia');
    }

    // create blog
    async createBlog(createBlogDto: CreateBlogDto): Promise<IBlog> {
        try{
            return await this.blogModel.create(createBlogDto);
        }catch(error){
            return undefined;
        }
    }

    // get all blogs
    async getBlogs(): Promise<IBlog[]> {
        try{
            const allBlogs = [];
            // get all blogs and sort by createdAt
            const blogs = await this.blogModel.find().sort({ createdAt: -1 });
            for(const blog of blogs) {
                // get all image ids from the blog
                const imageIds = blog.images.map(image => image);
                const videoIds = blog.videos.map(video => video);
                // get all image data urls
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
                // define a new project info object
                const blogInfo = {
                    ...blog.toObject(),
                    images: images,
                    videos: videos
                }
                // add bloginfo to the allBlogs array
                allBlogs.push(blogInfo);
            }
            return allBlogs;
        }catch(error){
            return undefined;
        }
    }

    // find blog by id
    async findBlogById(id: string): Promise<IBlog | any> {
        try{
            const blog = await this.blogModel.findOne({_id: id});
            const imageIds = blog.images.map(image => image);
            const videoIds = blog.videos.map(video => video);
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
            const blogInfo = {
                ...blog.toObject(),
                images: images,
                videos: videos
            }
            return blogInfo;
        }catch(error){
            return undefined;
        }
    }

    // find blog by title
    async findBlogByTitle(title: string): Promise<IBlog | any> {
        try{
            const blog = await this.blogModel.findOne({title: title});
            const imageIds = blog.images.map(image => image);
            const videoIds = blog.videos.map(video => video);
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
            const blogInfo = {
                ...blog.toObject(),
                images: images,
                videos: videos
            }
            return blogInfo;
        }catch(error){
            return undefined;
        }
    }

    // update blog with id
    async updateBlog(id: string, createBlogDto: CreateBlogDto): Promise<IBlog> {
        try{
            return await this.blogModel.findByIdAndUpdate(id, createBlogDto, { new: true });
        }catch(error){
            return undefined;
        }
    }

    // delete blog with id
    async deleteBlog(id: string): Promise<boolean> {
        try{
            const blog = await this.blogModel.findById(id);
            const images = blog.images.map(image => image);
            const videos = blog.videos.map(video => video);
            // delete images and videos from database
            await Promise.all(images.map(async (id) => await this.deleteFile(id)));
            await Promise.all(videos.map(async (id) => await this.deleteFile(id)));
            // delete the blog
            await this.blogModel.findByIdAndRemove(id);
            return true;
        }catch(error){
            return false;
        }
    }


    /* multer file reading */
    // read the file from the database
    private async readStream(id: string): Promise<GridFSBucketReadStream | any> {
        try{
            const fileStream = await this.fileModel.readFileStream(id);
            // get the file contenttype
            const contentType = await this.findInfo(id).then(result => result.contentType);
            // read data in chunks
            const chunks = [];
            fileStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            // convert the chunks to a buffer
            return new Promise((resolve, reject) => {
                fileStream.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    // convert the buffer to a base64 string
                    const base64 = buffer.toString('base64');
                    // convert the base64 string to a data url
                    const dataUrl = `data:${contentType};base64,${base64}`;
                    // resolve the data url
                    resolve(dataUrl);
                });
                // handle reject
                fileStream.on('error', (err) => {
                    reject(err);
                });
            });
        }catch(error){
            return error;
        }
    }

    private async findInfo(id: string): Promise<any> {
        try{
            const result = await this.fileModel
                .findById(id).catch( () => {throw new HttpException('File not found', HttpStatus.NOT_FOUND)} )
                .then(result => result)
                return{
                    filename: result.filename,
                    length: result.length,
                    chunkSize: result.chunkSize,
                    uploadDate: result.uploadDate,
                    contentType: result.contentType      
                }
        }catch(error){
            return error;
        }
    }

    // delete the file from the database
    private async deleteFile(id: string): Promise<boolean>{
        try{
            return await this.fileModel.delete(id)
        }catch(error){
            return false;
        }
    }
}
