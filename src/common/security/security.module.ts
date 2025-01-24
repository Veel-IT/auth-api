import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { UserModule } from 'src/user/user.module';

import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthGuard, LocalAuthGuard],
  exports: [JwtAuthGuard, LocalAuthGuard, JwtModule],
})
export class SecurityModule {}
