import { Body, Controller, Post, UseInterceptors, UploadedFiles, Get, Param, Delete, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import IEvent from 'src/interface/event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {}

    // create a new event
    @Post('create-event')
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async createEvent(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any },@Body() createEventDto: CreateEventDto,):Promise<IEvent> {
        // get all image ids
        const imageIds = files.images.map(image => image.id);
        // get all video ids
        const videoIds = files.videos.map(video => video.id);
        const {
            title:eventTitle, 
            details:eventDescription,
            snippet:eventSnippet, 
            startDate:startDate, 
            endDate:endDate, 
            time:eventTime, 
            venue:eventVenue,
        } = createEventDto;
        const eventDto = {
            title:eventTitle, 
            details:eventDescription,
            snippet:eventSnippet, 
            startDate:startDate, 
            endDate:endDate, 
            time:eventTime, 
            venue:eventVenue,
            images: imageIds,
            videos: videoIds,
        };
        return await this.eventService.createEvent(eventDto);
    }

    // get all events
    @Get('get-events')
    @ApiOkResponse({ type: CreateEventDto, isArray: true })
    async getEvents():Promise<IEvent[]> {
        return await this.eventService.getEvents();
    }

    // update a event by id
    @Patch('update-event/:id')
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event updated successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
    ]))
    async updateEvent(@UploadedFiles() files: { images?: Express.Multer.File[] | any, videos?: Express.Multer.File[] | any },@Body() createEventDto: CreateEventDto, @Param('id') id: string):Promise<IEvent> {
        // get all image ids
        const imageIds = files.images.map(image => image.id);
        // get all video ids
        const videoIds = files.videos.map(video => video.id);
        const {
            title:eventTitle, 
            details:eventDescription,
            snippet:eventSnippet, 
            startDate:startDate, 
            endDate:endDate, 
            time:eventTime, 
            venue:eventVenue,
        } = createEventDto;
        const eventDto = {
            title:eventTitle, 
            details:eventDescription,
            snippet:eventSnippet, 
            startDate:startDate, 
            endDate:endDate, 
            time:eventTime, 
            venue:eventVenue,
            images: imageIds,
            videos: videoIds,
        };
        return await this.eventService.updateEvent(id, eventDto);
    }

    // find a event by id
    @Get('find-event/:id')
    @ApiOkResponse({ type: CreateEventDto, isArray: false })
    async findEventById(@Param('id') id: string):Promise<IEvent> {
        return await this.eventService.findEventById(id);
    }

    // find a event by title
    @Get('find-event-by-title/:title')
    @ApiOkResponse({ type: CreateEventDto, isArray: false })
    async findEventByTitle(@Param('title') title: string):Promise<IEvent> {
        return await this.eventService.findEventByTitle(title);
    }

    // delete a event by id
    @Delete('delete-event/:id')
    @ApiOkResponse({ type: CreateEventDto, isArray: false, description: 'Event deleted successfully' })
    async deleteEvent(@Param('id') id: string):Promise<boolean> {
        return await this.eventService.deleteEvent(id);
    }
}
