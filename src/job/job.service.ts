import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Job, JobModel } from './schemas/job.schema';
import { Model, Connection } from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';
import {IJob} from '../interface/interfaces';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Job.name) private jobModel:Model<JobModel>,
        @InjectConnection() private readonly connection: Connection,
    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'jobMedia');
    }

    // create job
    async createJob(jobDto: CreateJobDto):Promise<IJob> {
        try{
            return this.jobModel.create(jobDto);
        }catch(error){
            return undefined;
        }
    }

    // get all jobs
    async getAllJobs():Promise<IJob[]> {
        try{
            const allJobs = [];
            const jobs = await this.jobModel.find().sort({createdAt: -1});
            for(const job of jobs){
                // get all image ids
                const imageIds = job.images.map(image => image);
                // get all the images from database
                const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
                const jobWithImages = {
                    ...job.toObject(),
                    images: images
                }
                allJobs.push(jobWithImages);
            }
            return allJobs;
        }catch(error){
            return undefined;
        }
    }

    // find job by id
    async findJobById(id: string):Promise<IJob | any> {
        try{
            const job = await this.jobModel.findById(id);
            // get all image ids
            const imageIds = job.images.map(image => image);
            // get all the images from database
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const jobWithImages = {
                ...job.toObject(),
                images: images
            }
            return jobWithImages;
        }catch(error){
            return undefined;
        }
    }

    // find job by title
    async findJobByTitle(title: string):Promise<IJob | any> {
        try{
            const job = await this.jobModel.findOne({title: title});
            // get all image ids
            const imageIds = job.images.map(image => image);
            // get all the images from database
            const images = await Promise.all(imageIds.map(async (id) => await this.readStream(id)));
            const jobWithImages = {
                ...job.toObject(),
                images: images
            }
            return jobWithImages;
        }catch(error){
            return undefined;
        }
    }

    // update a job
    async updateJob(id: string, jobDto: CreateJobDto):Promise<IJob> {
        try{
            const job = await this.jobModel.findByIdAndUpdate(id, jobDto, {new: true});
            return job;
        }catch(error){
            return undefined;
        }
    }

    // delete job
    async deleteJob(id: string):Promise<boolean> {
        try{
            const job = await this.jobModel.findById(id);
            // delete all images
            const imageIds = job.images.map(image => image);
            await Promise.all(imageIds.map(async (id) => await this.deleteFile(id)));
            // delete job
            await this.jobModel.findByIdAndDelete(id);
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
