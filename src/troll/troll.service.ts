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
import {ITroll} from 'src/interface/interfaces';
import { ClientService } from 'src/client/client.service';
import { TrolllikeService } from 'src/trolllike/trolllike.service';
import { TrollshareService } from 'src/trollshare/trollshare.service';
import { TrollcommentService } from 'src/trollcomment/trollcomment.service';

@Injectable()
export class TrollService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Troll.name) private trollModel:Model<TrollModel>,
        @InjectConnection() private readonly connection: Connection,
        private clientService: ClientService,
        private trollLikeService: TrolllikeService,
        private trollShareService: TrollshareService,
        private trollCommentService: TrollcommentService,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'trollMedia');
    }

    // create a new troll
    async createTroll(createTroll: CreateTrollDto): Promise<ITroll | any> {
        try{
            return await this.trollModel.create(createTroll);
        }catch(error){
            return error;
        }
    }

    // get all the trolls
    async findAll(): Promise<ITroll[]> {
        try{
            const allTrolls = [];
            const trolls = await this.trollModel.find().sort({createdAt: -1});
            for(const troll of trolls){
                // get all the likes
                const likes = await this.trollLikeService.getTrollLikes(troll._id);
                // get all shares
                const shares = await this.trollShareService.getTrollShares(troll._id);
                // get all comments
                const comments = await this.trollCommentService.getTrollComments(troll._id);
                // get the id's of the users who commented
                const commentUsers = comments.map(comment => comment.user);
                // get the user details of the users who commented
                const commentUsersDetails = await Promise.all(commentUsers.map(async (userId) => await this.clientService.getProfile(userId.toString())));
                // add the details of each user to the comment
                const commentsWithDetails = comments.map((comment:any, index) => ({
                    _id: comment._id,
                    troll: comment.troll,
                    comment: comment.comment,
                    user: commentUsersDetails[index],
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                }));  
                // get all image and video id's
                const imageIds = troll.images.map(image => image);
                const videoIds = troll.videos.map(video => video);
                // get the user id
                const clientId = troll.user.toString();
                // get the user profile
                const user = await this.clientService.getProfile(clientId);
                // get all image and video data
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const videos = await Promise.all(videoIds.map(async (id) => await this.readStream(id)));
                // add all retrieved data to the troll
                const trollWithData = {
                    ...troll.toObject(),
                    images: images,
                    videos: videos,
                    user: user,
                    likes: likes,
                    shares: shares,
                    comments: commentsWithDetails,
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
    async findById(id: string): Promise<ITroll | any> {
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
    async updateTroll(id: string, createTroll: CreateTrollDto): Promise<ITroll | any> {
        try{
            const troll = await this.trollModel.findByIdAndUpdate(id, createTroll, {new: true});
            return troll;
        }catch(error){
            return error;
        }
    }

    // update the likes of a troll
    async updateLikes(id: string, like: TrollLikeDto): Promise<ITroll | any> {
        try{
            // create like in the like service
            const trollLike = await this.trollLikeService.likeTroll(like);
            // add the like to the troll
            const troll = await this.trollModel.findByIdAndUpdate(id, {$push: {likes: trollLike._id}}, {new: true});
            return troll;
        }catch(error){
            return error;
        }
    }

    // upadate the comments of a troll
    async updateComments(id: string, comment: TrollCommentDto): Promise<ITroll | any> {
        try{
            const trollComment = await this.trollCommentService.commentTroll(comment);
            // add the comment to the troll
            const troll = await this.trollModel.findByIdAndUpdate(id, {$push: {comments: trollComment._id}}, {new: true});
            return troll;
        }catch(error){
            return error;
        }
    }

    // delete the comment
    async deleteComment(id: string, commentId: string): Promise<boolean> {
        try{
            // delete the comment
            // delete the comment from the comment service
            await this.trollCommentService.deleteTrollComment(commentId);
            await (await this.trollModel.findByIdAndUpdate(id, {$pull: {comments: commentId}}, {new: true}));
            return true;
        }catch(error){
            return error;
        }
    }

    // delete the like
    async deleteLike(id: string, likeId: string): Promise<boolean> {
        try{
            // delete the like from the like service
            await this.trollLikeService.unlikeTroll(likeId);
            // delete the like
            await this.trollModel.findByIdAndUpdate(id, {$pull: {likes: likeId}}, {new: true});
            return true;
        }catch(error){
            return error;
        }
    }

    // update shared status of the troll
    async updateShared(id: string, shared: TrollShareDto): Promise<ITroll | any> {
        try{
            const shareTroll = await this.trollShareService.shareTroll(shared);
            // find the troll and add the share to it
            const troll = await this.trollModel.findByIdAndUpdate(id, {$pull: {shares: shareTroll._id}});
            return troll;
        }catch(error){
            return error;
        }
    }

    // delete the troll
    async deleteTroll(id: string): Promise<boolean> {
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
