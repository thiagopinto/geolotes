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
import { SubdivisionService } from './subdivision.service';
import { CreateSubdivisionDto } from './dto/create-subdivision.dto';
import { UpdateSubdivisionDto } from './dto/update-subdivision.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Subdivision } from './entities/subdivision.entity';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';

@ApiTags('Subdivision')
@Controller('subdivision')
export class SubdivisionController {
  constructor(private readonly subdivisionService: SubdivisionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a subdivision' })
  @ApiResponse({
    status: 201,
    description: 'The subdivision has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'The subdivision has not been created',
  })
  @ApiOkResponse({ type: Subdivision })
  @ApiBody({ type: CreateSubdivisionDto })
  async create(
    @Body() createSubdivisionDto: CreateSubdivisionDto,
  ): Promise<Subdivision> {
    return await this.subdivisionService.create(createSubdivisionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subdivisions' })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiResponse({
    status: 200,
    description: 'The subdivisions have been successfully retrieved',
  })
  @ApiResponse({
    status: 400,
    description: 'The subdivisions have not been retrieved',
  })
  @ApiOkResponse({ type: PaginationResponseDto<Subdivision> })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Subdivision>> {
    return await this.subdivisionService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subdivision by id' })
  @ApiResponse({
    status: 200,
    description: 'The subdivision has been successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'The subdivision has not been found',
  })
  @ApiOkResponse({ type: Subdivision })
  async findOne(@Param('id') id: string): Promise<Subdivision | null> {
    return await this.subdivisionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subdivision by id' })
  @ApiResponse({
    status: 200,
    description: 'The subdivision has been successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'The subdivision has not been updated',
  })
  @ApiBody({ type: UpdateSubdivisionDto })
  @ApiOkResponse({ type: Subdivision })
  async update(
    @Param('id') id: string,
    @Body() updateSubdivisionDto: UpdateSubdivisionDto,
  ): Promise<Subdivision | null> {
    return await this.subdivisionService.update(+id, updateSubdivisionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subdivision by id' })
  @ApiResponse({
    status: 200,
    description: 'The subdivision has been successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'The subdivision has not been deleted',
  })
  @ApiOkResponse({ type: Subdivision })
  async remove(@Param('id') id: string): Promise<void> {
    await this.subdivisionService.remove(+id);
  }
}
