import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrollShare, TrollShareSchema } from './schemas/troll.share.schema';
import { TrollshareService } from './trollshare.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TrollShare.name, schema: TrollShareSchema },
        ]),
    ],
    providers: [TrollshareService],
    exports: [TrollshareService],
})

export class TrollshareModule {}
