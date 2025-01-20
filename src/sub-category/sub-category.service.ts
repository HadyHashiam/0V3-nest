/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.entity';
import { Category } from 'src/category/category.entity';
import { Model } from 'mongoose';
import { ApiFeatures } from 'src/utils/apiFeatures';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  //==================================================================================================================/
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });
    if (subCategory) {
      throw new HttpException('Sub Category already exist', 400);
    }

    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create new sub-Category
    const newSubCategory = await await this.subCategoryModel.create(
      createSubCategoryDto,
    );
    return {
      status: 200,
      message: 'Sub Category created successfully',
      data: newSubCategory,
    };
  }
  //==================================================================================================================/
  async findAll(query: any) {
    const totalDocuments = await this.subCategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(this.subCategoryModel.find(), query)
    .filter()
    .search('SubCategories')
    .sort()
    .limitFields()
    .paginate(totalDocuments);

    const subCategories = await apiFeatures.getQuery();
    return {
      status: 200,
      message: 'Sub Categories found',
      length: subCategories.length,
      isEmpty: subCategories.length > 0 ? 'false' : 'true',
      pagination: apiFeatures.paginationResult,
      data: subCategories,
    };
  }
  //==================================================================================================================/
  async findOne(_id: string) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }

    return {
      status: 200,
      message: 'Sub Category found',
      data: subCategory,
    };
  }
  //==================================================================================================================/
  // used in category service file
  async findByCategory(categoryId: string) {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subCategories = await this.subCategoryModel.find({
      category: categoryId,
    });

    return {
      status: 200,
      message: 'Subcategories found',
      length: subCategories.length,
      isEmpty: subCategories.length > 0 ? 'false' : 'true',
      data: subCategories,
    };
  }

  //==================================================================================================================/

  async update(_id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }

    const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(
      { _id },
      updateSubCategoryDto,
      { new: true },
    );

    return {
      status: 200,
      message: 'Sub Category updated successfully',
      data: updatedSubCategory,
    };
  }
  //==================================================================================================================/
  async remove(_id: string) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub Category not found');
    }
    await this.subCategoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Sub Category deleted successfully',
    };
  }
}
