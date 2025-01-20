import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.schema';

export type cartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: Product.name,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  cartItems: [
    {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      color: string;
    },
  ];

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;

  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: [
      {
        name: {
          type: String,
        },
        couponId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Coupon.name,
        },
      },
    ],
  })
  coupons: [
    {
      name: string;
      couponId: mongoose.Types.ObjectId; 
    },
  ];

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
  })
  user: typeof User;
}

export const cartSchema = SchemaFactory.createForClass(Cart);

// Populate Hooks
cartSchema.pre(/^find/, function (this: any, next) {
  this.populate([
    { path: 'user', select: '_id name' },
    {
      path: 'cartItems.productId',
      select: '_id title price Discount description',
    },
    { path: 'coupons.couponId', select: '_id name discount' },
  ]);
  next();
});