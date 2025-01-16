import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  SubCategory,
  subCategorySchema,
} from 'src/sub-category/sub-category.entity';
import { Category, categorySchema } from 'src/category/category.entity';
import { Product, productSchema } from './product.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: Category.name, schema: categorySchema },
      { name: SubCategory.name, schema: subCategorySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
