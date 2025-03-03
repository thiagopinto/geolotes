import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.save(createPaymentDto);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    subdivisionId?: number,
  ): Promise<PaginationResponseDto<Payment>> {
    const { page = 1, perPage = 10 } = paginationQuery;
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.contract', 'contract')
      .leftJoinAndSelect('contract.unit', 'unit')
      .leftJoinAndSelect('unit.subdivision', 'subdivision');

    if (subdivisionId) {
      queryBuilder.where('subdivision.id = :subdivisionId', { subdivisionId });
    }

    const [payments, total] = await queryBuilder.getManyAndCount();
    return new PaginationResponseDto(payments, total, page, perPage);
  }

  async findOne(id: number) {
    return await this.paymentRepository.findOne({
      where: { id },
      relations: ['contract', 'contract.unit', 'contract.unit.subdivision'],
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return await this.paymentRepository.update(id, updatePaymentDto);
  }

  async remove(id: number) {
    return await this.paymentRepository.delete(id);
  }
}
