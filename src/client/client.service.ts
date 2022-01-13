import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {IClient} from '../interface/interfaces';
import { Client, ClientModel } from './schemas/client.schema';
import { CreateCLientDto } from './dto/create-client.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
    private fileModel: MongoGridFS;
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientModel>,
        private jwtService: JwtService,
        @InjectConnection() private readonly connection: Connection,
    ){
        this.fileModel = new MongoGridFS(this.connection.db, 'profilePictures');
    }

    // register client
    async registerClient(createClientDto: CreateCLientDto): Promise<string>{
        try{
            createClientDto.email = createClientDto.username;
            createClientDto.displayName = createClientDto.firstName + " " + createClientDto.lastName;
            const _client = await this.creaateClient(createClientDto);
            if(_client._id){
                const payload = { username: _client.username, sub: _client._id };
                return this.jwtService.sign(payload);
            }
        }catch(error){
            return error;
        }
    }

    // log in user
    async loginClient(user:any): Promise<string>{
        try{
            const payload = { username: user.email, sub: user.userId };
            return this.jwtService.sign(payload);
        }catch(error){
            return error;
        }
    }

    // update client profile
    async updateProfile(id: string, updateClientDto: CreateCLientDto):Promise<ProfileInfoDto>{
        return this.updateClientProfile(id, updateClientDto);
    }

    // get user profile
    async getProfile(id: string): Promise<ProfileInfoDto>{
        const client = await this.getClientProfile(id);
        if(client === undefined) {
            return undefined;
        }
        return client;
    }

    // update profile picture
    async setNewProfilePicture(id: string, newPicture: string): Promise<string>{
        const client = await this.updateClientProfilePicture(id, newPicture);
        return client;
    }

    // delete profile picture
    async deleteProfilePicture(clientId:string):Promise<boolean>{
        try{
            const _client = await this.clientModel.findOne({_id: clientId})
            // update the profile image
            const isDeleted = await this.deleteFile(_client.image);
            _client.image = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            _client.save();
            return isDeleted;
        }catch(error){
            return false;
        }
    }

    // delete client data from database
    async deleteClientData(id:string): Promise<boolean>{
        const client = await this.clientModel.findOne({_id: id});
        // delete all images 
        await this.deleteFile(client.image);
        // find and delete the client
        const _client = await this.clientModel.findOneAndDelete({_id: id});
        if(_client){
            return true;
        }
        return false;
    }

    // validate client
    async validateClient(email: string, password: string):Promise<ProfileInfoDto>{
        const client = await this.findOne(email, password);
        if(client === undefined) {
            return undefined;
        }
        return client;
    }

    // validate google client
    async validateSocialClient(socialId: string, user:CreateCLientDto): Promise<IClient>{
        const client = await this.clientModel.findOne({socialId: socialId});
        if(client._id) {
            return client;
        }
        return await this.clientModel.create(user);
    }

    /* Private methods */

    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    // create a new client
    private async creaateClient(createClientDto: CreateCLientDto): Promise<IClient | any> {
        try{
            // check if email already exists
            const emailExists = await this.clientModel.findOne({email: createClientDto.username});
            if(emailExists){
                return {
                    status: "error",
                    message: "Email already exists"
                }
            }
            const saltRounds = 10;
            // generate salt 
            createClientDto.salt = await bcrypt.genSalt(saltRounds);
            // hash the password
            const hashedPassword = await this.hashPassword(createClientDto.password, createClientDto.salt);
            // add the new password and salt to the dto
            createClientDto.password = hashedPassword;
            // create a new user
            const createdClient = new this.clientModel(createClientDto);
            return await createdClient.save();
        }catch(error){
            return {
                message: error.message
            }
        }
    }

    // find one client (user)
    private async findOne(email: string, password:string): Promise<ProfileInfoDto | any> {
        try{
            const client = await this.clientModel.findOne({email: email});
            if(!client) {
                return undefined;
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, client.password);
            if(!isPasswordValid) {
                return null;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(client.image === defaultImage){
                profileImage = defaultImage;
            }else{
                profileImage = await Promise.resolve(this.readStream(client.image));
            }
            const userData = {
                ...client.toObject(),
                image : profileImage,
            }
            return userData;
        }catch(err){
            return undefined;
        }
    }

    // get the profile of a  client (user)
    private async getClientProfile(id: string): Promise<IClient | any> {
        try{
            const client = await this.clientModel.findOne({_id: id});
            if(!client) {
                return undefined;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(client.image === defaultImage){
                profileImage = defaultImage;
            }else{
                profileImage = await Promise.resolve(this.readStream(client.image));
            }
            const userData = {
                ...client.toObject(),
                image : profileImage,
            }
            return userData;
        }catch(err){
            return undefined;
        }
    }

    // update profile picture
    private async updateClientProfilePicture(id: string, picture: string): Promise<string>{
        const client = await this.clientModel.findOne({_id: id});
        if(client.image === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"){
            // update the client image to the new picture
            client.image = picture;
        }else{
            // delete the old picture from database
            await this.deleteFile(client.image);
            // update the client image to the new picture
            client.image = picture;
        }
        // save to database
        const updatedCLient = await client.save();
        return updatedCLient.image;
    }

    // update profile
    private async updateClientProfile(id: string, updateClientDto: CreateCLientDto): Promise<ProfileInfoDto>{
        // find and update the client
        await this.clientModel.findOneAndUpdate({_id: id}, updateClientDto, {new: true});
        const userData = await this.getClientProfile(id);
        return userData;
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
