import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Unit } from '../unit/entities/unit.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const { customerId, unitIds, price, installments } = createContractDto;

    // 🔥 Buscar o cliente no banco
    const customer = await this.customerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // 🔥 Buscar as unidades no banco
    const units = await this.unitRepository.find({
      where: { id: In(unitIds) },
    });
    if (units.length !== unitIds.length) {
      throw new NotFoundException('One or more units not found');
    }

    // Criar e salvar o contrato
    const contract = this.contractRepository.create({
      customer,
      units,
      price,
      installments,
    });
    return await this.contractRepository.save(contract);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Contract>> {
    const { page = 1, perPage = 10 } = paginationQuery;
    const [contracts, total] = await this.contractRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      relations: ['customer', 'units'],
    });
    return new PaginationResponseDto(contracts, total, page, perPage);
  }

  async findOne(id: number): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['customer', 'units'],
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async update(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    const { customerId, unitIds, price, installments } = updateContractDto;

    // 🔥 Buscar o contrato existente
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['units', 'customer'],
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // 🔥 Atualizar cliente se fornecido
    if (customerId) {
      const customer = await this.customerRepository.findOneBy({
        id: customerId,
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      contract.customer = customer;
    }

    // 🔥 Atualizar unidades se fornecido
    if (unitIds) {
      const units = await this.unitRepository.findByIds(unitIds);
      if (units.length !== unitIds.length) {
        throw new NotFoundException('One or more units not found');
      }
      contract.units = units;
    }

    // 🔥 Atualizar os outros campos opcionais
    if (price !== undefined) contract.price = price;
    if (installments !== undefined) contract.installments = installments;

    // 🔥 Salvar as alterações no banco
    return await this.contractRepository.save(contract);
  }

  async remove(id: number) {
    const contract = await this.contractRepository.findOne({
      where: { id },
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return this.contractRepository.delete(id);
  }
}
