import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.entity';

export type subCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;
}

export const subCategorySchema = SchemaFactory.createForClass(SubCategory);

subCategorySchema.pre(/^find/, function (this: any, next) {
  this.populate({ path: 'category', select: '_id name ' });
  next();
});


// subCategorySchema.pre('save', function (this: any, next) {
//   this.populate({ path: 'category', select: '_id name' });
//   next();
// });
