/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { TaxModule } from './tax/tax.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { UploadFilesModule } from './upload-files/upload-files.module';

@Module({
  imports: [
    // ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // 2- DB connection
    MongooseModule.forRoot(process.env.DB_URL),
    // Auth module JWt
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600000000s' },
    }),
    // MailerModule
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        // host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    TaxModule,
    ReviewModule,
    ProductModule,
    SuppliersModule,
    OrderModule,
    CartModule,
    UploadFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
