import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Model, Connection } from 'mongoose';
import {IEvent} from 'src/interface/interfaces';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsModel } from './schemas/events.schema';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class EventService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Event.name) private eventModel:Model<EventsModel>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'eventsMedia');
    }

    // create event
    async createEvent(eventDto: CreateEventDto):Promise<IEvent> {
        try{
            return this.eventModel.create(eventDto);
        }catch(error){
            return undefined;
        }
    }

    // get all events
    async getEvents():Promise<IEvent[]> {
        try{
            const allEvents = [];
            const events = await this.eventModel.find().sort({ createdAt: -1 });
            for(const event of events){
                const imageIds = event.images.map(image => image);
                const videosIds = event.videos.map(video => video);
                const images = await Promise.all(imageIds.map(async (imageId) => await this.readStream(imageId)));
                const videos = await Promise.all(videosIds.map(async (videoId) => await this.readStream(videoId)));
                const eventInfo = {
                    ...event.toObject(),
                    images: images,
                    videos: videos
                }
                allEvents.push(eventInfo);
            }
            return allEvents;
        }catch(error){
            return undefined;
        }
    }

    // find event by id
    async findEventById(id: string):Promise<IEvent | any> {
        try{
            const event = await this.eventModel.findById(id);
            const imageIds = event.images.map(image => image);
            const videosIds = event.videos.map(video => video);
            const images = await Promise.all(imageIds.map(async (imageId) => await this.readStream(imageId)));
            const videos = await Promise.all(videosIds.map(async (videoId) => await this.readStream(videoId)));
            const eventInfo = {
                ...event.toObject(),
                images: images,
                videos: videos
            }
            return eventInfo;
        }catch(error){
            return undefined;
        }
    }

    // find the event by title
    async findEventByTitle(title: string):Promise<IEvent | any> {
        try{
            const event = await this.eventModel.findOne({title: title});
            const imageIds = event.images.map(image => image);
            const videosIds = event.videos.map(video => video);
            const images = await Promise.all(imageIds.map(async (imageId) => await this.readStream(imageId)));
            const videos = await Promise.all(videosIds.map(async (videoId) => await this.readStream(videoId)));
            const eventInfo = {
                ...event.toObject(),
                images: images,
                videos: videos
            }
            return eventInfo;
        }catch(error){
            return undefined;
        }
    }

    // update event by id
    async updateEvent(id: string, eventDto: CreateEventDto):Promise<IEvent> {
        try{
            const event = await this.eventModel.findByIdAndUpdate(id, eventDto, {new: true});
            return event;
        }catch(error){
            return undefined;
        }
    }

    // delete the event by id
    async deleteEvent(id: string):Promise<boolean> {
        try{
            // find the event
            const event = await this.eventModel.findById(id);
            // get the image and video ids
            const imageIds = event.images.map(image => image);
            const videosIds = event.videos.map(video => video);
            // delete media from database
            await Promise.all(imageIds.map(async (imageId) => await this.deleteFile(imageId)));
            await Promise.all(videosIds.map(async (videoId) => await this.deleteFile(videoId)));
            // delete event from database
            await this.eventModel.findByIdAndDelete(id);
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
