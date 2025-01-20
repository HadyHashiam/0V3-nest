import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from './category.entity';
import { SubCategory, subCategorySchema } from 'src/sub-category/sub-category.entity';
import { SubCategoryService } from 'src/sub-category/sub-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
      { name: SubCategory.name, schema: subCategorySchema }, // إضافة SubCategory schema
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, SubCategoryService],
})
export class CategoryModule {}
