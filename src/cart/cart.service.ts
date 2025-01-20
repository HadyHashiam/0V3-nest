/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartItemsDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.entity';
import { Product } from 'src/product/product.entity';
import { Coupon } from 'src/coupon/coupon.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {}
  // =======================================================================================//

  private async calculateTotals(
    cartItems: Array<{ productId: mongoose.Types.ObjectId; quantity: number }>,
  ) {
    let totalPrice = 0;
    let totalPriceAfterDiscount = 0;

    for (const item of cartItems) {
      const product = await this.productModel.findById(item.productId);
      if (product) {
        const discount = product.Discount || 0; // discount for product
        const finalPrice = product.price - discount; // price for final Product after discount

        totalPrice += item.quantity * product.price; // total price before discount
        totalPriceAfterDiscount += item.quantity * finalPrice; // // total price after discount
      }
    }

    return { totalPrice, totalPriceAfterDiscount };
  }

  private async calculateTotalss(cartItems) {
    return cartItems.reduce(
      (totals, item) => {
        const product = item.productId as unknown as Product;
        const price = product.price || 0;
        const discount = product.Discount || 0; // discount for product
        const finalPrice = price - discount; // price for final Product after discount 

        totals.totalPrice += item.quantity * price; // total price before discount
        totals.totalPriceAfterDiscount += item.quantity * finalPrice; // total price after discount

        return totals;
      },
      { totalPrice: 0, totalPriceAfterDiscount: 0 },
    );
  }

  // =======================================================================================//

  public async create(productId: string, userId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    if (product.quantity <= 0)
      throw new NotFoundException('Product is out of stock');

    // search (!cart) create empty one
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await this.cartModel.create({
        cartItems: [],
        totalPrice: 0,
        user: userId,
      });
    }

    // add item for the first time or increase quantity
    const existingProduct = cart.cartItems.find((item) =>
      item.productId.equals(productId),
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.cartItems.push({ productId: product._id, quantity: 1, color: '' });
    }

    // calc the total price and total discount
    const { totalPrice, totalPriceAfterDiscount } = await this.calculateTotals(
      cart.cartItems,
    );

    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

    // save
    await cart.save();

    return {
      status: 200,
      message: 'Product added to cart',
      data: cart,
    };
  }
  //     data: {
  //   ...cart.toObject(),
  //   totalPrice: cart.totalPrice,
  //   totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
  // },
  // =======================================================================================//
  async update(
    productId: string,
    user_id: string,
    updateCartItemsDto: UpdateCartItemsDto,
  ) {
    
    let cart = await this.cartModel
    .findOne({ user: user_id })

    if (!cart) {
      return this.create(productId, user_id);
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // search for products with the specified product identifier in the cart list
    const productIndex = cart.cartItems.findIndex(
      (item) => item.productId._id.toString() === productId.toString(),
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    // update product color if available
    if (updateCartItemsDto.color) {
      cart.cartItems[productIndex].color = updateCartItemsDto.color;
    }

    // check the product quantity 
    const updatedQuantity =
      updateCartItemsDto.quantity || cart.cartItems[productIndex].quantity;
    if (updatedQuantity > product.quantity) {
      throw new NotFoundException(
        'Not enough quantity available for this product',
      );
    }

    // if (quantity ) update it
    cart.cartItems[productIndex].quantity = updatedQuantity;

    // calc price
    const { totalPrice, totalPriceAfterDiscount } = await this.calculateTotalss(
      cart.cartItems,
    );

    // update the price 
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

    // save
    await cart.save();

    return {
      status: 200,
      message: 'Product Updated',
      data: cart,
    };
  }
  // // =======================================================================================//

  async applyCoupon(user_id: string, couponName: string) {
    const cart = await this.cartModel.findOne({ user: user_id });
    const coupon = await this.couponModel.findOne({ name: couponName });

    if (!cart) {
      throw new NotFoundException('Not Found Cart');
    }
    if (!coupon) {
      throw new HttpException('Invalid coupon', 400);
    }
    const isExpired = new Date(coupon.expireDate) > new Date();
    if (!isExpired) {
      throw new HttpException('Invalid coupon', 400);
    }

    const ifCouponAlreadyUsed = cart.coupons.findIndex(
      (item) => item.name === couponName,
    );
    if (ifCouponAlreadyUsed !== -1) {
      throw new HttpException('Coupon already used', 400);
    }

    if (cart.totalPrice <= 0) {
      throw new HttpException('You have full discount', 400);
    }

    cart.coupons.push({ name: coupon.name, couponId: coupon._id });
    cart.totalPrice = cart.totalPrice - coupon.discount;
    await cart.save();

    return {
      status: 200,
      message: 'Coupon Applied',
      data: cart,
    };
  }
  // // =======================================================================================//

  async findOne(user_id: string) {
    const cart = await this.cartModel
    .findOne({ user: user_id })
    .select('-__v');
    if (!cart) {
      throw new NotFoundException(
        `You don't have cart please go to add products`,
      );
    }

    return {
      status: 200,
      message: 'Found Cart',
      data: cart,
    };
  }
  // // =======================================================================================//

  // // =======================================================================================//

  async remove(productId: string, user_id: string) {
    const cart = await this.cartModel
    .findOne({ user: user_id })
  

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // search for product in the cart
    const indexProductToRemove = cart.cartItems.findIndex(
      (item) => item.productId._id.toString() === productId.toString(),
    );

    if (indexProductToRemove === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    // remove product from cart
    cart.cartItems.splice(indexProductToRemove, 1);

    // calc price for product after removing product from cart and updating price
    const { totalPrice, totalPriceAfterDiscount } = cart.cartItems.reduce(
      (totals, item) => {
        const product = item.productId as unknown as Product;
        const price = product.price || 0;
        const discountPrice = product.Discount || price;

        totals.totalPrice += item.quantity * price;
        totals.totalPriceAfterDiscount += item.quantity * discountPrice;

        return totals;
      },
      { totalPrice: 0, totalPriceAfterDiscount: 0 },
    );

    // update the total price and discount price for the current item and discount
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

    await cart.save();

    return {
      status: 200,
      message: 'Product removed from cart',
      data: cart,
    };
  }

  // // ==========================================================================================================================================================================//

  // // ===== For Admin ======== \\

  async findOneForAdmin(userId: string) {
    const cart = await this.cartModel
    .findOne({ user: userId })
    if (!cart) {
      throw new NotFoundException('Not Found Cart');
    }
    return {
      status: 200,
      message: 'Found Cart',
      data: cart,
    };
  }
  // // =======================================================================================//

  async findAllForAdmin() {
    const carts = await this.cartModel.find();
    return {
      status: 200,
      message: 'Found All Carts',
      length: carts.length,
      data: carts,
    };
  }
}
