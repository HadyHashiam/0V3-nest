import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';

import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { CreateTaxDto } from './dto/create-tax.dto';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  //  @docs  Can Admin Create Or Update Tax
  //  @Route  POST /api/v1/tex
  //  @access Private [admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createTexDto: CreateTaxDto) {
    return this.taxService.createOrUpdate(createTexDto);
  }

  //  @docs  Can Admin Get Tax
  //  @Route  GET /api/v1/tex
  //  @access Private [admin]
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  find() {
    return this.taxService.find();
  }

  //  @docs  Can Admin ReSet Tes
  //  @Route  DELETE /api/v1/tex
  //  @access Private [admin]
  @Delete()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  reSet() {
    return this.taxService.reSet();
  }
}
