import { Body, Controller, Post, UseInterceptors, UploadedFiles, Param, Delete, Patch, Get } from '@nestjs/common';
import { JobService } from './job.service';
import IJob from '../interface/job.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('job')
export class JobController {
    constructor(private jobService: JobService) {}

    // create a new job
    @Post('create-job')
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job created successfully' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('images'))
    async createJob(@UploadedFiles() files: Express.Multer.File[] | any, @Body() createJobDto: CreateJobDto): Promise<IJob> {
        let imageIds: string[] = [];
        // get all image ids if images is not empty
        if(files.images) {
            imageIds = files.images.map(image => image.id);
        }
        const {
            title:jobTitle, 
            details:jobDescription,
            snippet:jobSnippet, 
            expireDate:expireDate, 
            location:jobLocation,
            logo:companyLogo,
            company:companyName,
            url:companyUrl,
        } = createJobDto;
        const jobDto = {
            title:jobTitle, 
            details:jobDescription,
            snippet:jobSnippet, 
            expireDate:expireDate, 
            location:jobLocation,
            logo:companyLogo,
            company:companyName,
            url:companyUrl,
            images: imageIds,
        }
        return await this.jobService.createJob(jobDto);
    }

    // get all jobs
    @Get('get-jobs')
    @ApiOkResponse({ type: CreateJobDto, isArray: true, description: 'All jobs' })
    async getAllJobs(): Promise<IJob[]> {
        return await this.jobService.getAllJobs();
    }

    // find job by id
    @Get('find-job/:id')
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job found successfully' })
    async findJobById(@Param('id') id: string): Promise<IJob> {
        return await this.jobService.findJobById(id);
    }

    // find job by title
    @Get('find-job/:title')
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job found successfully' })
    async findJobByTitle(@Param('title') title: string): Promise<IJob> {
        return this.jobService.findJobByTitle(title);
    }

    // update job
    @Patch('update-job/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('images'))
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job updated successfully' })
    async updateJob(@UploadedFiles() files: Express.Multer.File[] | any, @Param('id') id: string, @Body() createJobDto: CreateJobDto): Promise<IJob> {
        let imageIds: string[] = [];
        // get all image ids if images is not empty
        if(files.images) {
            imageIds = files.images.map(image => image.id);
        }
        const {
            title:jobTitle, 
            details:jobDescription,
            snippet:jobSnippet, 
            expireDate:expireDate, 
            location:jobLocation,
            logo:companyLogo,
            company:companyName,
            url:companyUrl,
        } = createJobDto;
        const jobDto = {
            title:jobTitle, 
            details:jobDescription,
            snippet:jobSnippet, 
            expireDate:expireDate, 
            location:jobLocation,
            logo:companyLogo,
            company:companyName,
            url:companyUrl,
            images: imageIds,
        }
        return await this.jobService.updateJob(id, jobDto);
    }

    // delete job
    @Delete('delete-job/:id')
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job deleted successfully' })
    async deleteJob(@Param('id') id: string): Promise<boolean> {
        return await this.jobService.deleteJob(id);
    }
}
