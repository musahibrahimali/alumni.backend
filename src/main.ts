import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'debug', 'verbose']
  });

  // middlewares
  app.use(cookieParser());
  app.use(helmet());

  // global pipes
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle("Alumni Web App Api")
  .setDescription("This is the backend api interface for the alumni web project")
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // start up server
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port).then(() => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Swagger running on port http://localhost:${port}/api`);
    console.log("Press CTRL-C to stop server");
  }).catch((err) => {
    console.log("There was an error starting server. ", err);
  });
}

bootstrap();
