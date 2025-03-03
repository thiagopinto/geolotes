import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Unit } from './entities/unit.entity';
import { PaginationUnitQueryDto } from './dto/pagination-unit-query.dto';

@ApiTags('Unit')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}
  @ApiOperation({ summary: 'Create a unit' })
  @ApiResponse({
    status: 201,
    description: 'The unit has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'The unit has not been created',
  })
  @ApiOkResponse({ type: Unit })
  @ApiBody({ type: CreateUnitDto })
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({
    status: 200,
    description: 'The units have been successfully retrieved',
  })
  @ApiResponse({
    status: 400,
    description: 'The units have not been retrieved',
  })
  @ApiOkResponse({ type: [Unit] })
  @ApiQuery({ name: 'subdivisionId', required: false, type: Number }) // Parâmetro opcional
  @Get()
  async findAll(
    @Query() paginationUnitQuery: PaginationUnitQueryDto, // Parâmetro opcional
  ): Promise<Unit[]> {
    return this.unitService.findAll(paginationUnitQuery);
  }

  @ApiOperation({ summary: 'Get a unit by id' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been successfully retrieved',
  })
  @ApiOkResponse({ type: [Unit] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a unit by id' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'The unit has not been updated',
  })
  @ApiOkResponse({ type: Unit })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(+id, updateUnitDto);
  }

  @ApiOperation({ summary: 'Delete a unit by id' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'The unit has not been deleted',
  })
  @ApiOkResponse({ type: Unit })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }
}
