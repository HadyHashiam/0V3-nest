import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.entity';
import { SubCategory } from 'src/sub-category/sub-category.entity';
import { ApiFeatures } from 'src/utils/apiFeatures';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name)
    private readonly categoryModule: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModule: Model<SubCategory>,
  ) {}

  //#############################################################

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOne({
      title: createProductDto.title,
    });
    const category = await this.categoryModule.findById(
      createProductDto.category,
    );

    if (product) {
      throw new HttpException('This Product already Exist', 400);
    }

    if (!category) {
      throw new HttpException('This Category not Exist', 400);
    }

    if (createProductDto.subCategory) {
      const subCategory = await this.subCategoryModule.findById(
        createProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
      const priceAfterDiscount = createProductDto?.priceAfterDiscount || 0;
      if (createProductDto.price < priceAfterDiscount) {
        throw new HttpException(
          'price Must be greater the discount price',
          400,
        );
      }
    }

    const newProduct = await await this.productModel.create(createProductDto);
    return {
      status: 200,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  //#############################################################

  async findAll(query: any) {
    const totalDocuments = await this.productModel.countDocuments();
    const apiFeatures = new ApiFeatures(this.productModel.find(), query)
    .filter()
    .search('Products')
    .sort()
    .limitFields()
    .paginate(totalDocuments);

    const products = await apiFeatures.getQuery();
    return {
      status: 200,
      message: 'Found Products',
      isEmpty: products.length > 0 ? 'false' : 'true',
      length: products.length,
      pagination: apiFeatures.paginationResult,
      data: products,
    };
  }

  //#############################################################

  async findOne(id: string) {
    const product = await this.productModel.findById(id)
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return {
      status: 200,
      message: 'Found a Product',
      data: product,
    };
  }

  //#############################################################

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    if (updateProductDto.category) {
      const category = await this.categoryModule.findById(
        updateProductDto.category,
      );
      if (!category) {
        throw new HttpException('This Category not Exist', 400);
      }
    }
    if (updateProductDto.subCategory) {
      const subCategory = await this.subCategoryModule.findById(
        updateProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
    }

    if (product.quantity < updateProductDto.sold) {
      throw new HttpException('The Quantity is < sold', 400);
    }

    const price = updateProductDto?.price || product.price;
    const priceAfterDiscount =
      updateProductDto?.priceAfterDiscount || product.Discount;
    if (price < priceAfterDiscount) {
      throw new HttpException(
        'Must be price After discount greater than price',
        400,
      );
    }

    return {
      status: 200,
      message: 'Product Updated successfully',
      data: await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
      })
    };
  }

  //#############################################################

  async remove(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    await this.productModel.findByIdAndDelete(id);
      return {
        status: 200,
        message: 'Product deleted successfully',
      };
  }
}
