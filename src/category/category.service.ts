/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.entity';
import { Model } from 'mongoose';
import { ApiFeatures } from 'src/utils/apiFeatures';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  //#############################################################
  /**
   *  Create a new category
   * @param createCategoryDto
   * @returns
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (category) {
      throw new HttpException('Category already exist', 400);
    }
      // Create new category
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }
  //#############################################################
  async findAll(query: any) {
    const totalDocuments = await this.categoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(this.categoryModel.find(), query)
    .filter()
    .search('Categories') // يمكنك تعديل الكلمة حسب احتياجات البحث
    .sort()
    .limitFields()
    .paginate(totalDocuments);

    const categories = await apiFeatures.getQuery();
    return {
      status: 200,
      message: 'Categories found',
      length: categories.length,
      isEmpty: categories.length > 0 ? 'false' : 'true',
      pagination: apiFeatures.paginationResult,
      data: categories,
    };
  }
  //#############################################################
  async findOne(_id: number) {
    const category = await this.categoryModel.findOne({ _id }).select('-__v');
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      status: 200,
      message: 'Category found',
      data: category,
    };
  }
  //#############################################################
  async update(_id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoryModel
    .findByIdAndUpdate({ _id }, updateCategoryDto, { new: true })
    .select('-__v');

    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }
  //#############################################################
  async remove(_id: string) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
