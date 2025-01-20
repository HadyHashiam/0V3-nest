import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from './cart.entity';
import { Product, productSchema } from 'src/product/product.entity';
import { Coupon, couponSchema } from 'src/coupon/coupon.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: cartSchema,
      },
      {
        name: Product.name,
        schema: productSchema,
      },
      {
        name: Coupon.name,
        schema: couponSchema,
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
