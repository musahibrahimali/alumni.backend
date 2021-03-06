import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { GoogleStrategy,FacebookStrategy } from './strategies/strategies';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schemas/client.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { JwtStrategy } from 'src/authorization/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [ClientService],
})
export class ClientModule {}
