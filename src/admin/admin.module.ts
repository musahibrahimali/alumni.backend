import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [
    AdminService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
