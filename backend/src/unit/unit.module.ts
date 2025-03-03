import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { SubdivisionModule } from 'src/subdivision/subdivision.module';
import { forwardRef } from '@nestjs/common';
import { ContractModule } from 'src/contract/contract.module';
import { Subdivision } from 'src/subdivision/entities/subdivision.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Unit, Subdivision]),
    forwardRef(() => SubdivisionModule),
    forwardRef(() => ContractModule),
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, TypeOrmModule],
})
export class UnitModule {}
