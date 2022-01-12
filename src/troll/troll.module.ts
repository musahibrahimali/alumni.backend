import { Module } from '@nestjs/common';
import { TrollService } from './troll.service';
import { TrollController } from './troll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Troll, TrollSchema } from './schemas/troll.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Troll.name, schema: TrollSchema},
    ]),
  ],
  providers: [TrollService],
  controllers: [TrollController],
  exports: [TrollService],
})
export class TrollModule {}
