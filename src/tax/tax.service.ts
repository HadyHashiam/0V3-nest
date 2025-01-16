import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Tax } from './tax.entity';
import { CreateTaxDto } from './dto/create-tax.dto';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private readonly texModel: Model<Tax>) {}
  async createOrUpdate(createTexDto: CreateTaxDto) {
    const tex = await this.texModel.findOne({});
    if (!tex) {
      // Create New Tax
      const newTex = await this.texModel.create(createTexDto);
      return {
        status: 200,
        message: 'Tax created successfully',
        data: newTex,
      };
    }
    // Update Tax
    const updateTex = await this.texModel
    .findOneAndUpdate({}, createTexDto, {
      new: true,
    })
    .select('-__v');
    return {
      status: 200,
      message: 'Tax Updated successfully',
      data: updateTex,
    };
  }

  async find() {
    const tex = await this.texModel.findOne({}).select('-__v');

    return {
      status: 200,
      message: 'Tax found successfully',
      data: tex,
    };
  }

  async reSet(): Promise<void> {
    await this.texModel.findOneAndUpdate({}, { taxPrice: 0, shippingPrice: 0 });
  }
}
/*
tex table:
{ taxPrice: 3, shippingPrice: 2 }
*/
