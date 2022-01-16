import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpStatus, 
    Param, 
    Patch, 
    Post, 
    Request, 
    Response, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors,
} from '@nestjs/common';
import { CreateCLientDto } from './dto/create-client.dto';
import { ClientService } from './client.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { boolean } from 'joi';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard, FacebookAuthGuard,JwtAuthGuard } from 'src/authorization/authorizations';

@Controller('client')
export class ClientController {
    constructor(
        private clientService: ClientService,
        private configService: ConfigService,
    ){}
    

    @ApiCreatedResponse({type: String})
    @Post('register')
    async registerClient(@Body() createClientDto: CreateCLientDto, @Response({passthrough: true}) response): Promise<{access_token: string}>{
        const domain = this.configService.get("DOMAIN");
        const token = await this.clientService.registerClient(createClientDto);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    @ApiCreatedResponse({type: String})
    @Post('login')
    async loginClient(@Body() createClientDto: CreateCLientDto, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const client = await this.clientService.validateClient(createClientDto);
        const token = await this.clientService.loginClient(client);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // google authentication
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    // google callback
    @ApiCreatedResponse({type: String})
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Request() request, @Response({passthrough: true}) response):Promise<any>{
        const originUrl = this.configService.get("ORIGIN_URL");
        const token = await this.clientService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        // redirect to client page
        response.redirect(`${originUrl}/client/home`);
    }

    // facebook auth
    @Get("facebook")
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    // facebook callback
    @ApiCreatedResponse({type: String})
    @Get('facebook/callback')
    async facebookCallback(@Request() request, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const token = await this.clientService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        response.redirect('/');
        return {access_token : token};
    }

    // update profile picture
    @ApiCreatedResponse({type: String})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile-picture/:id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File | any):Promise<string>{
        const fileId: string = file.id;
        return this.clientService.setNewProfilePicture(id, fileId);
    }

    // update profile
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile:/id')
    async updateClientProfile(@Param("id") id: string, @Body() updateCLientDto: CreateCLientDto): Promise<ProfileInfoDto>{
        return this.clientService.updateProfile(id, updateCLientDto);
    }

    // get the user profile information
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<ProfileInfoDto> {
        const {userId} = request.user;
        return this.clientService.getProfile(userId);
    }

    // delete profile picture
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param("id") id: string):Promise<boolean>{
        return this.clientService.deleteProfilePicture(id);
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
    async deleteCLientData(@Param("id") id: string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return this.clientService.deleteClientData(id);
    }
}
