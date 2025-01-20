import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Suppliers } from './supplier.entity';
import { Model } from 'mongoose';
import { ApiFeatures } from 'src/utils/apiFeatures';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Suppliers.name) private suppliersModule: Model<Suppliers>,
  ) {}

  async create(createSuppliersDto: CreateSupplierDto) {
    const supplier = await this.suppliersModule.findOne({
      name: createSuppliersDto.name,
    });
    if (supplier) {
      throw new HttpException('supplier already exist', 400);
    }

    const newSupplier = await this.suppliersModule.create(createSuppliersDto);
    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll(query: any) {
    const totalDocuments = await this.suppliersModule.countDocuments();
    const apiFeatures = new ApiFeatures(this.suppliersModule.find(), query)
    .filter()
    .search('Suppliers') 
    .sort()
    .limitFields()
    .paginate(totalDocuments);

    const suppliers = await apiFeatures.getQuery();
    return {
      status: 200,
      message: 'Suppliers found',
      length: suppliers.length,
      isEmpty: suppliers.length > 0 ? 'false' : 'true',
      pagination: apiFeatures.paginationResult,
      data: suppliers,
    };
  }

  async findOne(id: string) {
    const supplier = await this.suppliersModule.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return {
      status: 200,
      message: 'Brand found',
      data: supplier,
    };
  }

  async update(id: string, updateSuppliersDto: UpdateSupplierDto) {
    const supplier = await this.suppliersModule.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const updatedSupplier = await this.suppliersModule.findByIdAndUpdate(
      id,
      updateSuppliersDto,
      {
        new: true,
      },
    );
    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.suppliersModule.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    await this.suppliersModule.findByIdAndDelete(id);
  }
}
