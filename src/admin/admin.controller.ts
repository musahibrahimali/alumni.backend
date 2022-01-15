import { 
    Controller, 
    Post, 
    Body, 
    Response, 
    UseGuards, 
    Patch, 
    UseInterceptors, 
    Param, 
    UploadedFile, 
    Request, 
    Get, 
    Delete 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authorization/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminProfileInfoDto } from './dto/admin.profile.response.dto';
import { boolean } from 'joi';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private configService: ConfigService,
    ) {}

    // create a new admin
    @ApiCreatedResponse({type: String})
    @Post('create-admin')
    async createAdmin(@Body() createAdminDto: CreateAdminDto, @Response({passthrough: true}) response): Promise<{access_token: string}> {
        const {
            username,
            password,
            firstName,
            lastName, 
            phone,
        } = createAdminDto;
        const adminDto = {
            username: username,
            password: password, 
            email: username,
            firstName: firstName, 
            lastName: lastName, 
            displayName: firstName + ' ' + lastName,
            phone: phone
        }
        const domain = this.configService.get("DOMAIN");
        const token = await this.adminService.registerAdmin(adminDto);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // login an admin
    @ApiCreatedResponse({type: String})
    @Post('login')
    async loginClient(@Body() createAdminDto: CreateAdminDto, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const admin = await this.adminService.validateAdmin(createAdminDto);
        const token = await this.adminService.loginAdmin(admin);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // update profile picture
    @ApiCreatedResponse({type: String})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile-picture/:id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File | any):Promise<string>{
        const fileId: string = file.id;
        return this.adminService.setNewProfilePicture(id, fileId);
    }

    // update profile
    @ApiCreatedResponse({type: AdminProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile/:id')
    async updateClientProfile(@Param('id') id: string, @Body() updateClientDto: CreateAdminDto): Promise<AdminProfileInfoDto>{
        return this.adminService.updateProfile(id, updateClientDto);
    }

    // get the user profile information
    @ApiCreatedResponse({type: AdminProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<AdminProfileInfoDto> {
        const {userId} = request.user;
        return this.adminService.getProfile(userId);
    }

    // delete profile picture
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param('id') id: string):Promise<boolean>{
        return this.adminService.deleteProfilePicture(id);
    }

    // log out user
    @ApiCreatedResponse({type: null})
    @Get('logout')
    async logoutClient(@Response({passthrough: true}) response): Promise<null>{
        response.cookie('access_token', '', { maxAge: 1 });
        response.redirect('/');
        return null;
    }

    // delete user account
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Delete('delete-user/:id')
    async deleteCLientData(@Param('id') id: string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return this.adminService.deleteAdminData(id);
    }
}
