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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Contract } from './entities/contract.entity';

@ApiTags('Contracts')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({
    status: 201,
    description: 'The contract has been successfully created.',
    type: Contract,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOkResponse({ type: Contract })
  @ApiBody({ type: CreateContractDto })
  async create(
    @Body() createContractDto: CreateContractDto,
  ): Promise<Contract> {
    return this.contractService.create(createContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all contracts.',
    type: PaginationResponseDto<Contract>,
  })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiOkResponse({ type: PaginationResponseDto<Contract> })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Contract>> {
    return this.contractService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the contract with the specified ID.',
    type: Contract,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiOkResponse({ type: Contract })
  async findOne(@Param('id') id: string): Promise<Contract> {
    return this.contractService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated contract.',
    type: Contract,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOkResponse({ type: Contract })
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    return await this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'The contract has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async remove(@Param('id') id: string) {
    return await this.contractService.remove(+id);
  }
}
