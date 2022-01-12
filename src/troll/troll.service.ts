import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Troll, TrollModel } from './schemas/troll.schema';
import { Model, Connection } from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';
import { CreateTrollDto } from './dto/create-troll.dto';
import { TrollShareDto } from './dto/share.dto';
import { TrollLikeDto } from './dto/like.dto';
import { TrollCommentDto } from './dto/comment.dto';
import { TrollLike, TrollLikeModel } from './schemas/troll.like.schema';
import { TrollComment, TrollCommentModel } from './schemas/troll.comment.schema';
import { TrollShare, TrollShareModel } from './schemas/troll.share.schema';

@Injectable()
export class TrollService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Troll.name) private trollModel:Model<TrollModel>,
        @InjectModel(TrollLike.name) private trollLikeModel:Model<TrollLikeModel>,
        @InjectModel(TrollComment.name) private trollCommentModel:Model<TrollCommentModel>,
        @InjectModel(TrollShare.name) private trollShareModel:Model<TrollShareModel>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'newsMedia');
    }

    // create a new troll
    async create(createTroll: CreateTrollDto): Promise<Troll> {
        try{
            return await this.trollModel.create(createTroll);
        }catch(error){
            return error;
        }
    }

    // get all the trolls
    async findAll(): Promise<Troll[]> {
        try{
            const allTrolls = [];
            const trolls = await this.trollModel.find().sort({createdAt: -1});
            for(const troll of trolls){
                // get all image and video id's
                const imageIds = troll.images.map(image => image);
                const videoIds = troll.videos.map(video => video);
                // get all image and video data
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
                // add all retrieved data to the troll
                const trollWithData = {
                    ...troll.toObject(),
                    images: images,
                    videos: videos,
                }
                // add the troll to the array
                allTrolls.push(trollWithData);
            }
            return allTrolls;
        }catch(error){
            return error;
        }
    }

    // find troll by id
    async findById(id: string): Promise<Troll> {
        try{
            const troll = await this.trollModel.findById(id);
            // get all image and video id's
            const imageIds = troll.images.map(image => image);
            const videoIds = troll.videos.map(video => video);
            // get all image and video data
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
            // add all retrieved data to the troll
            const trollWithData = {
                ...troll.toObject(),
                images: images,
                videos: videos,
            }
            return trollWithData;
        }catch(error){
            return error;
        }
    }

    // update troll
    async update(id: string, createTroll: CreateTrollDto): Promise<Troll> {
        try{
            const troll = await this.trollModel.findByIdAndUpdate(id, createTroll, {new: true});
            return troll;
        }catch(error){
            return error;
        }
    }

    // update the likes of a troll
    async updateLikes(id: string, like: TrollLikeDto): Promise<Troll> {
        try{
            // find the troll
            const troll = await this.trollModel.findOne({_id: id});
            // update the likes with the new like object
            const updatedTroll = await this.trollModel.findByIdAndUpdate(id, {likes: [...troll.likes, like]}, {new: true});
            // save the updated troll
            return await updatedTroll.save();
        }catch(error){
            return error;
        }
    }

    // upadate the comments of a troll
    async updateComments(id: string, comment: TrollCommentDto): Promise<Troll> {
        try{
            // find the troll
            const troll = await this.trollModel.findOne({_id: id});
            // update the comments with the new comment object
            const updatedTroll = await this.trollModel.findByIdAndUpdate(id, {comments: [...troll.comments, comment]}, {new: true});
            // save the updated troll
            return await updatedTroll.save();
        }catch(error){
            return error;
        }
    }

    // delete the comment
    async deleteComment(id: string, commentId: string): Promise<Troll |any> {
        return "";
    }

    // delete the like
    async deleteLike(id: string, likeId: string): Promise<Troll | any> {
        return "";
    }

    // update shared status of the troll
    async updateShared(id: string, shared: TrollShareDto): Promise<Troll | any> {
        return "";
    }

    // delete the troll
    async delete(id: string): Promise<boolean> {
        try{
            const troll = await this.trollModel.findById(id);
            // delete all images and videos
            const images = troll.images.map(image => image);
            const videos = troll.videos.map(video => video);
            await Promise.all(images.map(async (id) => await this.deleteFile(id)));
            await Promise.all(videos.map(async (id) => await this.deleteFile(id)));
            // delete the troll
            await this.trollModel.deleteOne({_id: id});
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
