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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authorization/authorizations';
@Controller('troll')
export class TrollController {
    constructor(private trollService: TrollService){}

    // create a new troll
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll created successfully' })
    @Post('create-troll')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createTroll(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any }, @Body() createTrollDto:CreateTrollDto): Promise<ITroll | any>{
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

        createTrollDto.images = imageIds;
        createTrollDto.videos = videoIds;

        const troll = await this.trollService.createTroll(createTrollDto);
        return troll;
    }

    // get all trolls
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll retrieved successfully' })
    @Get('all-trolls')
    async getAllTrolls(): Promise<ITroll[]>{
        return this.trollService.findAll();
    }

    // update troll
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll updated successfully' })
    @Patch('update-troll/:id')
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
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll created successfully' })
    @Get('find-troll/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async findTrollById(@Param('id') id: string): Promise<ITroll>{
        return await this.trollService.findById(id);
    }

    // add a comment
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll comment created successfully' })
    @Patch('add-comment/:id')
    async addTrollComment(@Param('id') id: string, @Body() createCommentDto: TrollCommentDto):Promise<ITroll>{
        const {user, troll, comment} = createCommentDto;
        const commentDto = {
            user: user,
            troll: troll,
            comment: comment,
        }
        return this.trollService.updateComments(id, commentDto);
    }

    // delete comment
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll comment deleted successfully' })
    @Delete('delete-comment/:id')
    async deleteTrollComment(@Param('id') id:string, @Body() trollId: string):Promise<boolean>{
        return await this.trollService.deleteComment(id, trollId);
    }

    // update like
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll like created successfully' })
    @Patch('like-troll/:id')
    async likeTroll(@Param('id') id: string, @Body() trollLikeDto: TrollLikeDto):Promise<ITroll>{
        return await this.trollService.updateLikes(id, trollLikeDto);
    }

    // delete like
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll like deleted successfully' })
    @Delete('delete-like/:id')
    async deleteLike(@Param('id') id:string, @Body() commentId:string):Promise<boolean>{
        return await this.trollService.deleteLike(id, commentId);
    }

    // update shares
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll shared successfully' })
    @Patch('share-troll/:id')
    async shareTroll(@Param('id') id:string, @Body() trollShareDto:TrollShareDto):Promise<ITroll>{
        return await this.trollService.updateShared(id, trollShareDto);
    }

    // delete troll
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateTrollDto, isArray: false, description: 'Troll deleted successfully' })
    @Delete('delete-troll/:id')
    async deleteTroll(@Param('id') id: string):Promise<boolean>{
        return await this.trollService.deleteTroll(id);
    }
}
