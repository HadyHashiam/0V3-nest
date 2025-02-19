/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

/**
 *
 *
 */
import { JWTPayLoadType } from '../utils/utiltypes';
import { UserType } from '../utils/enums';
import { JwtService } from '@nestjs/jwt';

/**
 *
 *
 */
const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  //============================================================================================================//
  /*
   * generate JSON WEB Token (JWT)
   * @param payload => JWT payload
   * @returns token
   */
  private generateJwt(payload: JWTPayLoadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
  //============================================================================================================//
  /**
   *  Hashing password
   * @param password plain text => password
   * @returns   hashedPassword
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  //============================================================================================================//

  /**
   * Create new User
   * @param {RegisterDto} registerDto  data for create new user  // {} if javascript
   * @returns   JWT (access token) ,  data: newUser,  status: 200 , 'User created successfully'
   */

  public async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: signUpDto.email });
      if (user) {
        throw new HttpException('User already exist', 400);
      }

      const password = signUpDto.password;
      // const password = await bcrypt.hash(signUpDto.password, saltOrRounds);
      const userCreated = {
        password,
        role: 'user',
        active: true,
      };
      const newUser = await this.userModel.create({
        ...signUpDto,
        ...userCreated,
      });

      const accessToken = await this.generateJwt({
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        status: 200,
        message: 'User created successfully',
        data: newUser,
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  /**
   * login user
   * @param loginDto data for login
   * @returns JWT (access token)  status: 200, 'User logged in successfully', data: user
   */

  async signIn(signInDto: SignInDto) {
    // email, password
    const user = await this.userModel
    .findOne({ email: signInDto.email })
    .select('-__v');
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.generateJwt({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: accessToken,
    };
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */
  async resetPassword({ email }: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    // create code 6 digit
    const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

    // تشفير الكود باستخدام SHA256
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    // insert code in db=> verificationCode
    await this.userModel.findOneAndUpdate(
      { email },
      {
        verificationCode: hashedCode,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
        passwordResetVerified: false,
      },
    );
    // send code to user email
    const htmlMessage = `
    <div>
      <h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
      <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
      <h6 style="font-weight: bold">Ecommerce-Nest.JS</h6>
    </div>
    `;

    this.mailService.sendMail({
      from: `Ecommerce-Nest.JS <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Ecommerce-Nest.JS - Your password reset code (valid for 10 min)`,
      html: htmlMessage,
    });
    return {
      status: 200,
      message: `Code sent successfully on your email (${email})`,
    };
  }

  async verifyCode({ code }: { code: string }) {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    // find user by hashedPassword
    const user = await this.userModel.findOne({
      verificationCode: hashedCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired code');
    }

    // update user status
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        verificationCode: null, // remove code
        passwordResetVerified: true, // update status
      },
    );

    return {
      status: 200,
      message: 'Code verified successfully, go to change your password',
    };
  }

  async changePassword(changePasswordData: SignInDto) {
    const user = await this.userModel.findOne({
      email: changePasswordData.email,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const password = await bcrypt.hash(
      changePasswordData.password,
      saltOrRounds,
    );
    await this.userModel.findOneAndUpdate(
      { email: changePasswordData.email },
      {
        password,
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: null,
      },
    );
    return {
      status: 200,
      message: 'Password changed successfully, go to login',
    };
  }
}
