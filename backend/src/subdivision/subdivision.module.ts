import { forwardRef, Module } from '@nestjs/common';
import { SubdivisionService } from './subdivision.service';
import { SubdivisionController } from './subdivision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subdivision } from './entities/subdivision.entity';
import { UnitModule } from 'src/unit/unit.module';
import { ContractModule } from 'src/contract/contract.module';
import { Unit } from 'src/unit/entities/unit.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { Customer } from 'src/customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subdivision, Unit, Contract, Customer]),
    forwardRef(() => UnitModule),
    forwardRef(() => ContractModule),
    forwardRef(() => CustomerModule),
  ],
  controllers: [SubdivisionController],
  providers: [SubdivisionService],
  exports: [SubdivisionService, TypeOrmModule],
})
export class SubdivisionModule {}
