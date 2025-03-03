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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Customer } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOkResponse({ type: Customer })
  @ApiBody({ type: CreateCustomerDto })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all customers.',
  })
  @ApiQuery({ type: PaginationQueryDto })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.customerService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the customer with the specified ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the customer',
  })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated customer.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the customer',
  })
  @ApiBody({ type: UpdateCustomerDto })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted customer.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the customer',
  })
  async remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
