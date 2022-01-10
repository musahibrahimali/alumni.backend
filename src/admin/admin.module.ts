import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';

@Module({
  imports: [],
  providers: [AdminService],
  controllers: [],
  exports: [AdminService],
})
export class AdminModule {}
