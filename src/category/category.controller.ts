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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { SubCategoryService } from 'src/sub-category/sub-category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService, // أضف SubCategoryService هنا
  ) {}
  //#################################################################
  //  @docs   Admin Can create a new category
  //  @Route  POST /category
  //  @access Private [Admin]
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }
  //########################################################
  //  @docs   Any User Can get categories
  //  @Route  GET /category
  //  @access Public
  @Get()
  findAll(@Query() query) {
    return this.categoryService.findAll(query);
  }
  //########################################################
  //  @docs   Any User Can get any category
  //  @Route  GET /api/v1/category/:id
  //  @access Public
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }
  //############################################################
  //  @docs   Any User Can get all sub-Categories for specific category
  //  @Route  GET /category/:id/subcategories
  //  @access Public
  @Get(':id/subcategories')
  findSubCategories(@Param('id') categoryId: string) {
    return this.subCategoryService.findByCategory(categoryId);
  }
  //#########################################################
  //  @docs   Admin Can update any category
  //  @Route  UPDATE /api/v1/category/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
  //#############################################################
  //  @docs   Admin Can delete any category
  //  @Route  DELETE /api/v1/category/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
