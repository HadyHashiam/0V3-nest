import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './brand.entity';
import { ApiFeatures } from 'src/utils/apiFeatures'; // استيراد ApiFeatures

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (brand) {
      throw new HttpException('Brand already exist', 400);
    }
      // create new brand
    const newBrand = await this.brandModel.create(createBrandDto);
    return {
      status: 200,
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  //#############################################################
  async findAll(query: any) {
    const totalDocuments = await this.brandModel.countDocuments();
    const apiFeatures = new ApiFeatures(this.brandModel.find(), query)
    .filter()
    .search('Brands') // يمكن تعديل الكلمة إذا لزم الأمر
    .sort()
    .limitFields()
    .paginate(totalDocuments);

    const brands = await apiFeatures.getQuery();
    return {
      status: 200,
      message: 'Brands found',
      length: brands.length,
      isEmpty: brands.length > 0 ? 'false' : 'true',
      pagination: apiFeatures.paginationResult,
      data: brands,
    };
  }
  //#############################################################

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return {
      status: 200,
      message: 'Brand found',
      data: brand,
    };
  }
  //#############################################################

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const updatedBrand = await this.brandModel.findByIdAndUpdate(
      id,
      updateBrandDto,
      {
        new: true,
      },
    );
    return {
      status: 200,
      message: 'Brand updated successfully',
      data: updatedBrand,
    };
  }
  //#############################################################

  async remove(id: string): Promise<void> {
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.brandModel.findByIdAndDelete(id);
  }
}
