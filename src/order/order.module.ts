import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, orderSchema } from './order.entity';
import { Cart, cartSchema } from 'src/cart/cart.entity';
import { Tax, taxSchema } from 'src/tax/tax.entity';
import { Product, productSchema } from 'src/product/product.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: Cart.name, schema: cartSchema },
      { name: Tax.name, schema: taxSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
