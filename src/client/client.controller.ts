import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '../authorization/guards/jwt-auth.guard';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { ClientParamDto } from './dto/client.id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { boolean } from 'joi';
import { ConfigService } from '@nestjs/config';

@Controller('client')
export class ClientController {
    constructor(
        private clientService: ClientService,
        private configService: ConfigService,
    ){}
    

    @ApiCreatedResponse({type: String})
    @Post('register')
    async registerClient(@Body() createClientDto: CreateCLientDto, @Response({passthrough: true}) response): Promise<{access_token: string}>{
        const {
            username, password, firstName, lastName, displayName,
        } = createClientDto;
        const user = {
            username, password, firstName, lastName, displayName,
        }
        const domain = this.configService.get("DOMAIN");
        const token = await this.clientService.registerClient(user);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    @ApiCreatedResponse({type: String})
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async loginClient(@Request() request, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const token = await this.clientService.loginClient(request.user);
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
    async updateProfilePicture(@Param() param: ClientParamDto, @UploadedFile() file: Express.Multer.File | any):Promise<string>{
        const {id} = param;
        const fileId: string = file.id;
        return this.clientService.setNewProfilePicture(id, fileId);
    }

    // update profile
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile:/id')
    async updateClientProfile(@Param() param: ClientParamDto, @Body() updateCLientDto: CreateCLientDto): Promise<ProfileInfoDto>{
        const {id} = param;
        return this.clientService.updateProfile(id, updateCLientDto);
    }

    // get the user profile information
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<ProfileInfoDto> {
        const {clientId} = request.user;
        return this.clientService.getProfile(clientId);
    }

    // delete profile picture
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param() param: ClientParamDto):Promise<boolean>{
        const {id} = param;
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
    async deleteCLientData(@Param() param: ClientParamDto, @Response({passthrough: true}) response): Promise<boolean>{
        const {id} = param;
        response.cookie('access_token', '', { maxAge: 1 });
        return this.clientService.deleteClientData(id);
    }
}
