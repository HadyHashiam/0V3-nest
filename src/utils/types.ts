import { Types } from 'mongoose';

export type JWTPayLoadType = {
  _id: Types.ObjectId;
  email: string;
  role: string;
};

export type AccessTokenType = {
  accessToken: string;
};
