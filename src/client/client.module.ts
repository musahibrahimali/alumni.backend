import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/constants';
import { LocalStrategy,JwtStrategy } from './strategies/strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [ClientService],
})
export class ClientModule {}
