import { 
    Body, 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFiles, 
    Param, 
    Delete, 
    Patch, 
    Get, 
    UseGuards
} from '@nestjs/common';
import { JobService } from './job.service';
import {IJob} from 'src/interface/interfaces';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiOkResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authorization/authorizations';

@Controller('job')
export class JobController {
    constructor(private jobService: JobService) {}

    // create a new job
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job created successfully' })
    @Post('create-job')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('images'))
    async createJob(@UploadedFiles() files: Express.Multer.File[] | any, @Body() createJobDto: CreateJobDto): Promise<IJob> {
        let imageIds: string[] = [];
        // get all image ids if images is not empty
        if(files?.images) {
            imageIds = files.images.map(image => image.id);
        }
        const {
            title, 
            details,
            snippet, 
            expireDate, 
            location,
            logo,
            company,
            url,
        } = createJobDto;
        const jobDto = {
            title, 
            details,
            snippet, 
            expireDate, 
            location,
            logo,
            company,
            url,
            images: imageIds,
        }
        return await this.jobService.createJob(jobDto);
    }

    // get all jobs
    @ApiOkResponse({ type: CreateJobDto, isArray: true, description: 'All jobs' })
    @Get('get-jobs')
    async getAllJobs(): Promise<IJob[]> {
        return await this.jobService.getAllJobs();
    }

    // find job by id
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job found successfully' })
    @Get('find-job/:id')
    async findJobById(@Param('id') id: string): Promise<IJob> {
        return await this.jobService.findJobById(id);
    }

    // find job by title
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job found successfully' })
    @Get('find-job/:title')
    async findJobByTitle(@Param('title') title: string): Promise<IJob> {
        return this.jobService.findJobByTitle(title);
    }

    // update job
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job updated successfully' })
    @Patch('update-job/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('images'))
    async updateJob(@UploadedFiles() files: Express.Multer.File[] | any, @Param('id') id: string, @Body() createJobDto: CreateJobDto): Promise<IJob> {
        let imageIds: string[] = [];
        // get all image ids if images is not empty
        if(files.images) {
            imageIds = files.images.map(image => image.id);
        }
        const {
            title, 
            details,
            snippet, 
            expireDate, 
            location,
            logo,
            company,
            url,
        } = createJobDto;
        const jobDto = {
            title, 
            details,
            snippet, 
            expireDate, 
            location,
            logo,
            company,
            url,
            images: imageIds,
        }
        return await this.jobService.updateJob(id, jobDto);
    }

    // delete job
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: CreateJobDto, isArray: false, description: 'Job deleted successfully' })
    @Delete('delete-job/:id')
    async deleteJob(@Param('id') id: string): Promise<boolean> {
        return await this.jobService.deleteJob(id);
    }
}
