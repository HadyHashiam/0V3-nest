/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerInterceptor } from 'src/utils/interceptor/togger.interceptor';

import { AuthGuard } from './guard/Auth.guard';
import { Roles } from './decorator/Roles.decorator';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  @docs   Admin Can Create User
  //  @Route  POST /api/v1/user
  //  @access Private [admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }
  //  @docs   Admin Can Get All Users
  //  @Route  GET /api/v1/user
  //  @access Private [admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggerInterceptor)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  //  @docs   Admin Can Get Single User
  //  @Route  GET /api/v1/user/:id
  //  @access Private [admin]
  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  //  @docs   Admin Can Update Single User
  //  @Route  UPDATE /api/v1/user/:id
  //  @access Private [admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
  //  @docs   Admin Can Delete Single User
  //  @Route  DELETE /api/v1/user/:id
  //  @access Private [admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

@Controller('api/userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  // For User
  //  @docs   Any User can get data on your account
  //  @Route  GET /api/v1/user/me
  //  @access Private [user, admin]
  @Get()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }
  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/user/me
  //  @access Private [user, admin]
  @Patch()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  updateMe(
    @Req() req,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(req.user, updateUserDto);
  }
  //  @docs   Any User can unActive your account
  //  @Route  DELETE /api/v1/user/me
  //  @access Private [user]
  @Delete()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user);
  }
}
