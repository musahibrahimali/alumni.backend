import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminService } from '../admin.service';
import IAdmin from '../../interface/admin.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private adminService: AdminService){
        super();
    }

    async validate(username:string, password: string):Promise<IAdmin | any>{
        const admin = await this.adminService.validateAdmin(username, password);
        if(!admin){
            throw new UnauthorizedException("There was an error validating admin");
        }
        return admin;
    }
}