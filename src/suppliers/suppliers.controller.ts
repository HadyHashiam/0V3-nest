/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/Roles.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  //  @docs   Admin Can create a new Suppliers
  //  @Route  POST /suppliers
  //  @access Private [Admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSuppliersDto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(createSuppliersDto);
  }

  //  @docs   Any User Can get all Suppliers
  //  @Route  GET /suppliers
  //  @access Public
  @Get()
  findAll(@Query() query) {
    return this.suppliersService.findAll(query);
  }

  //  @docs   Any User Can get single Suppliers
  //  @Route  GET /suppliers
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  //  @docs   Admin can update a supplier
  //  @Route  PATCH /suppliers
  //  @access Private [admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSuppliersDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, updateSuppliersDto);
  }

  //  @docs   Admin can delete a Supplier
  //  @Route  DELETE /suppliers
  //  @access Private [admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
