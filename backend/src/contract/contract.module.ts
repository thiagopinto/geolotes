import { Module, forwardRef } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { UnitModule } from 'src/unit/unit.module';
import { CustomerModule } from 'src/customer/customer.module';
import { SubdivisionModule } from 'src/subdivision/subdivision.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    forwardRef(() => UnitModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => SubdivisionModule),
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService, TypeOrmModule],
})
export class ContractModule {}
