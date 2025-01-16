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
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/Roles.decorator';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}
  //###############################################################################################\
  //  @docs   Admin Can create a new sub category
  //  @Route  POST /sub-category
  //  @access Private [Admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoryService.create(createSubCategoryDto);
  }
  //###############################################################################################
  //  @docs   Any User Can get sub categorys
  //  @Route  GET /sub-category
  //  @access Public
  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }
  //###############################################################################################
  //  @docs   Any User Can get any sub category
  //  @Route  GET /sub-category/:id
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }
  //###############################################################################################
  //  @docs   Admin Can update any sub category
  //  @Route  UPDATE /sub-category/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }
  //###############################################################################################

  //  @docs   Admin Can delete any sub category
  //  @Route  DELETE /sub-category/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
