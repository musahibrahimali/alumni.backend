import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/config/configuration';
import { RolesGuard } from 'src/authorization/guards/roles.guard';
import { EventModule } from 'src/event/event.module';
import { JobModule } from 'src/job/job.module';
import { TrollModule } from 'src/troll/troll.module';
import { NewsModule } from 'src/news/news.module';
import { ClientModule } from 'src/client/client.module';
import { AdminModule } from 'src/admin/admin.module';
import { BlogModule } from 'src/blog/blog.module';
import * as Joi from 'joi';

@Module({
  imports: [
    // configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      expandVariables: true,
      // validate stuff with Joi
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
      validationOptions: {
        // allow unknown keys (change to false to fail on unknown keys)
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    // connect to mongodb database
    MongooseModule.forRoot("mongodb://localhost/alumni-nest"), 
    // other modules
    AdminModule,
    ClientModule,
    TrollModule,
    EventModule,
    JobModule,
    NewsModule,
    BlogModule,
    TrollModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // }
  ],
})
export class AppModule {}
