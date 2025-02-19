import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    min: [3, 'password must be at least 3 characters'],
    max: [20, 'password must be at most 20 characters'],
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: ['user', 'admin'],
  })
  role: string;

  @Prop({
    type: String,
  })
  avatar: string;

  @Prop({
    type: Number,
  })
  age: number;

  @Prop({
    type: String,
  })
  phoneNumber: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: Boolean,
    enum: [false, true],
  })
  active: boolean;

  @Prop({
    type: String,
  })
  verificationCode: string;

  @Prop({
    type: Date,
  })
  passwordChangedAt: Date;

  @Prop({
    type: Date,
  })
  passwordResetExpires: Date;

  @Prop({
    type: Boolean,
  })
  passwordResetVerified: boolean;

  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// mongoose middleware to hash the password before saving the user
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.pre('find', function (next) {
  this.select('-password -__v');
  next();
});


// UserSchema.pre('find', function(next) {
//   console.log('Executing find query for user :', this.getQuery());
//   next();
// });
