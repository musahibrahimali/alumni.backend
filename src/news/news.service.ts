import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { NewsModel, New } from './schemas/news.schema';
import { GridFSBucketReadStream } from 'mongodb';
import INews from '../interface/news.interface';
import { CreateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(New.name) private newsModel:Model<NewsModel>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'newsMedia');
    }

    // create new news
    async createNews(news: CreateNewsDto): Promise<INews> {
        try{
            return await this.newsModel.create(news);
        }catch(error){
            return error;
        }
    }

    // get all news
    async getAllNews(): Promise<INews[]> {
        try{
            const allNews = [];
            const news = await this.newsModel.find().sort({createdAt: -1});
            for(const newItem of news){
                // get all image ids
                const imageIds = newItem.images.map(image => image);
                const videosIds = newItem.videos.map(video => video);
                // get all the images and videos from database
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const videos = await Promise.all(videosIds.map(async (id) => await this.readStream(id)));
                // add the images and videos to the news object
                const newItemWithImages = {
                    ...newItem.toObject(),
                    images: images,
                    videos: videos
                }
                allNews.push(newItemWithImages);
            }
            return allNews;
        }catch(error){
            return error;
        }
    }

    // find news by id
    async findNewsById(id: string): Promise<INews | any> {
        try{
            const news = await this.newsModel.findById(id);
            // get all image ids
            const imageIds = news.images.map(image => image);
            const videosIds = news.videos.map(video => video);
            // get all the images and videos from database
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const videos = await Promise.all(videosIds.map(async (id) => await this.readStream(id)));
            // add the images and videos to the news object
            const newItemWithImages = {
                ...news.toObject(),
                images: images,
                videos: videos
            }
            return newItemWithImages;
        }catch(error){
            return error;
        }
    }

    // find news by title
    async findNewsByTitle(title: string): Promise<INews | any> {
        try{
            const news = await this.newsModel.findOne({title: title});
            // get all image ids
            const imageIds = news.images.map(image => image);
            const videosIds = news.videos.map(video => video);
            // get all the images and videos from database
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const videos = await Promise.all(videosIds.map(async (id) => await this.readStream(id)));
            // add the images and videos to the news object
            const newItemWithImages = {
                ...news.toObject(),
                images: images,
                videos: videos
            }
            return newItemWithImages;
        }catch(error){
            return error;
        }
    }

    // update the news
    async updateNews(id: string, news: CreateNewsDto): Promise<INews> {
        try{
            const updatedNews = await this.newsModel.findByIdAndUpdate(id, news, {new: true});
            return updatedNews;
        }catch(error){
            return error;
        }
    }

    // delete news
    async deleteNews(id: string): Promise<boolean> {
        try{
            const news = await this.newsModel.findById(id);
            // delete all images
            const images = news.images.map(image => image);
            const videos = news.videos.map(video => video);
            await Promise.all(images.map(async (id) => await this.deleteFile(id)));
            await Promise.all(videos.map(async (id) => await this.deleteFile(id)));
            // delete the news
            await this.newsModel.findByIdAndDelete(id);
            return true;
        }catch(error){
            return error;
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
