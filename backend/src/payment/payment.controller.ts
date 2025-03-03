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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { Payment } from './entities/payment.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'The payment has been successfully created.',
    type: Payment,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOkResponse({ type: Payment })
  @ApiBody({ type: CreatePaymentDto })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all payments.',
    type: PaginationResponseDto<Payment>,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'subdivisionId', required: false, type: Number }) // 🔥 Define o parâmetro opcional no Swagger
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('subdivisionId') subdivisionId?: number, // 🔥 Parâmetro opcional
  ): Promise<PaginationResponseDto<Payment>> {
    return this.paymentService.findAll(paginationQuery, subdivisionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment with the specified ID.',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Payment })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated payment.',
    type: Payment,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOkResponse({ type: Payment })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'The payment has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
