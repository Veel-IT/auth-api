import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './common/security/security.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    SecurityModule,
    DatabaseModule,
  ],
})
export class AppModule {}
