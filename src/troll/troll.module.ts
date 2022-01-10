import { Module } from '@nestjs/common';
import { TrollService } from './troll.service';
import { TrollController } from './troll.controller';

@Module({
  imports: [],
  providers: [TrollService],
  controllers: [TrollController],
  exports: [TrollService],
})
export class TrollModule {}
