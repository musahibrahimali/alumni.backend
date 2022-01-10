import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import IClient from 'src/interface/client.interface';
import { ClientService } from '../client.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private adminService: ClientService){
        super();
    }

    async validate(username:string, password: string):Promise<IClient | any>{
        const client = await this.adminService.validateClient(username, password);
        if(!client){
            throw new UnauthorizedException("There was an error validating user");
        }
        return client;
    }
}