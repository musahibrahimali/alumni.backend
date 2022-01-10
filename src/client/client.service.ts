import { Injectable } from '@nestjs/common';
import IClient from 'src/interface/client.interface';

@Injectable()
export class ClientService {
    async registerClient(): Promise<IClient | any>{
        return "registering client";
    }

    async loginClient(): Promise<IClient|any>{
        return "loging in client";
    }

    async getProfile(): Promise<IClient|any>{
        return "User profile details";
    }

    async validateClient(email: string, password: string):Promise<IClient|any>{
        return "validating client";
    }
}
