import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';
import { LoggerInterceptor } from 'src/utils/interceptor/togger.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //  @docs   Sign Up
  //  @Route  POST /auth/sign-up
  //  @access Public
  @Post('sign-up')
  @UseInterceptors(LoggerInterceptor)
  signUp(
    @Body()
    signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }
  //  @docs   Sign In
  //  @Route  POST /auth/login
  //  @access Public
  @Post('login')
  @UseInterceptors(LoggerInterceptor)
  signIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   */

  //  @docs   Any User Can Reset Password
  //  @Route  POST /auth/reset-password
  //  @access Public
  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    email: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email);
  }
  //  @docs   Any User Can Virify Code
  //  @Route  POST /auth/virify-code
  //  @access Public
  @Post('virify-code')
  virifyCode(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    virifyCode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.virifyCode(virifyCode);
  }

  //  @docs   Any User Can change password
  //  @Route  POST /auth/change-password
  //  @access Private for users=> admin, user
  @Post('change-password')
  changePassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    changePasswordData: SignInDto,
  ) {
    return this.authService.changePassword(changePasswordData);
  }
}
