import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { CreateCLientDto } from './dto/create-client.dto';
import IClient from 'src/interface/client.interface';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
    constructor(private clientService: ClientService){}

    @Post('register')
    async registerClient(@Body() createClientDto: CreateCLientDto): Promise<IClient|any>{
        return this.clientService.registerClient();
    }

    @Post('login')
    async loginClient(@Request() request, @Response({passthrough: true}) response):Promise<IClient|any>{
        return this.clientService.loginClient();
    }

}
