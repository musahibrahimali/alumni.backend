import { 
    Body, 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFiles, 
    Get, 
    Param, 
    Patch, 
    Delete
} from '@nestjs/common';
import { TrollService } from './troll.service';
import { CreateTrollDto } from './dto/create-troll.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import {ITroll} from '../interface/interfaces';
import { TrollCommentDto } from './dto/comment.dto';
import { TrollLikeDto } from './dto/like.dto';
import { TrollShareDto } from './dto/share.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
// import { Troll } from './schemas/troll.schema';
// import { TrollLike } from '../trolllike/schemas/troll.like.schema';
// import { TrollShare } from '../trollshare/schemas/troll.share.schema';
import { TrollComment } from '../trollcomment/schemas/troll.comment.schema';
// import { Client } from '../client/schemas/client.schema';

@Controller('troll')
// @UseInterceptors(MongooseClassSerializerInterceptor(Client))
// @UseInterceptors(MongooseClassSerializerInterceptor(Troll))
// @UseInterceptors(MongooseClassSerializerInterceptor(TrollLike))
// @UseInterceptors(MongooseClassSerializerInterceptor(TrollShare))
@UseInterceptors(MongooseClassSerializerInterceptor(TrollComment))
export class TrollController {
    constructor(private trollService: TrollService){}

    // create a new troll
    @Post('create-troll')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createTroll(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createTrollDto:CreateTrollDto): Promise<ITroll>{
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
            user :userId,
            post :post
        } = createTrollDto;

        const userDto = {
            user: userId,
            post: post,
            images: imageIds,
            videos: videoIds,
        }
        const troll = await this.trollService.createTroll(userDto);
        return troll;
    }

    // get all trolls
    @Get('all-trolls')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll retrieved successfully' })
    async getAllTrolls(): Promise<ITroll[]>{
        return this.trollService.findAll();
    }

    // update troll
    @Patch('update-troll/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll updated successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async updateTroll(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Param('id') id: string, @Body() createTrollDto: CreateTrollDto): Promise<ITroll>{
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
            user :userId,
            post :post
        } = createTrollDto;

        const userDto = {
            user: userId,
            post: post,
            images: imageIds,
            videos: videoIds,
        }
        return this.trollService.updateTroll(id, userDto);
    }

    // find troll by id
    @Get('find-troll/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async findTrollById(@Param('id') id: string): Promise<ITroll>{
        return await this.trollService.findById(id);
    }

    // add a comment
    @Patch('add-comment/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll comment created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async addTrollComment(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Param('id') id: string, @Body() createCommentDto: TrollCommentDto):Promise<ITroll>{
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

        const {user, troll, comment} = createCommentDto;
        const commentDto = {
            user: user,
            troll: troll,
            comment: comment,
            images: imageIds,
            videos: videoIds,
        }

        return this.trollService.updateComments(id, commentDto);
    }

    // delete comment
    @Delete('delete-comment/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll comment deleted successfully' })
    async deleteTrollComment(@Param('id') id:string, @Body() trollId: string):Promise<boolean>{
        return this.trollService.deleteComment(id, trollId);
    }

    // update like
    @Patch('like-troll/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll like created successfully' })
    async likeTroll(@Param('id') id: string, @Body() trollLikeDto: TrollLikeDto):Promise<ITroll>{
        return this.trollService.updateLikes(id, trollLikeDto)
    }

    // delete like
    @Delete('delete-like/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll like deleted successfully' })
    async deleteLike(@Param('id') id:string, @Body() commentId:string):Promise<boolean>{
        return this.trollService.deleteLike(id, commentId);
    }

    // update shares
    @Patch('share-troll/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll shared successfully' })
    async shareTroll(@Param('id') id:string, @Body() trollShareDto:TrollShareDto):Promise<ITroll>{
        return this.trollService.updateShared(id, trollShareDto);
    }

    // delete troll
    @Delete('delete-troll/:id')
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll deleted successfully' })
    async deleteTroll(@Param('id') id: string):Promise<boolean>{
        return this.trollService.deleteTroll(id);
    }
}
