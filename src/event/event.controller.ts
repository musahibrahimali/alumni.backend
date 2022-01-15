import { 
    Body, 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFiles, 
    Get, 
    Param,
    Delete, 
    Patch, 
    UseGuards
} from '@nestjs/common';
import { EventService } from './event.service';
import IEvent from 'src/interface/event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authorization/authorizations';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {}

    // create a new event
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event created successfully' })
    @Post('create-event')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createEvent(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any },@Body() createEventDto: CreateEventDto,):Promise<IEvent | any> {
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
            startDate, 
            endDate, 
            time, 
            venue,
        } = createEventDto;
        const eventDto = {
            title, 
            details,
            snippet, 
            startDate, 
            endDate, 
            time, 
            venue,
            images: imageIds,
            videos: videoIds,
        };
        return await this.eventService.createEvent(eventDto);
    }

    // get all events
    @ApiOkResponse({ type: CreateEventDto, isArray: true })
    @Get('get-events')
    async getEvents():Promise<IEvent[]> {
        return await this.eventService.getEvents();
    }

    // update a event by id
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event updated successfully' })
    @Patch('update-event/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async updateEvent(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any },@Body() createEventDto: CreateEventDto, @Param('id') id: string):Promise<IEvent> {
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
            startDate, 
            endDate, 
            time, 
            venue,
        } = createEventDto;
        const eventDto = {
            title, 
            details,
            snippet, 
            startDate, 
            endDate, 
            time, 
            venue,
            images: imageIds,
            videos: videoIds,
        };
        return await this.eventService.updateEvent(id, eventDto);
    }

    // find a event by id
    @ApiOkResponse({ type: CreateEventDto, isArray: false })
    @Get('find-event/:id')
    async findEventById(@Param('id') id: string):Promise<IEvent> {
        return await this.eventService.findEventById(id);
    }

    // find a event by title
    @ApiOkResponse({ type: CreateEventDto, isArray: false })
    @Get('find-event-by-title/:title')
    async findEventByTitle(@Param('title') title: string):Promise<IEvent> {
        return await this.eventService.findEventByTitle(title);
    }

    // delete a event by id
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event deleted successfully' })
    @Delete('delete-event/:id')
    async deleteEvent(@Param('id') id: string):Promise<boolean> {
        return await this.eventService.deleteEvent(id);
    }
}
