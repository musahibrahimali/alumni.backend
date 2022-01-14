import { Module } from '@nestjs/common';
import { TrollService } from './troll.service';
import { TrollController } from './troll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Troll, TrollSchema } from './schemas/troll.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { ClientModule } from 'src/client/client.module';
import { TrolllikeModule } from 'src/trolllike/trolllike.module';
import { TrollcommentModule } from 'src/trollcomment/trollcomment.module';
import { TrollshareModule } from 'src/trollshare/trollshare.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Troll.name, schema: TrollSchema },
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    ClientModule,
    TrolllikeModule,
    TrollcommentModule,
    TrollshareModule,
  ],
  providers: [TrollService],
  controllers: [TrollController],
  exports: [TrollService],
})
export class TrollModule {}
