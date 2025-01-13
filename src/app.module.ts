import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    // ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // envFilePath: '.env.development',
    }),
    MongooseModule.forRoot(process.env.DB_URL), // 2- DB connection
    UserModule, //  UserModule
    AuthModule, // AuthModule
    JwtModule.register({
      // Auth module JWt
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600000000s' },
    }),
    MailerModule.forRoot({
      // MailerModule
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
