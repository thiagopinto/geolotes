import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUnitQueryDto } from './dto/pagination-unit-query.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}
  create(createUnitDto: CreateUnitDto) {
    return this.unitRepository.save(createUnitDto);
  }

  async findAll(paginationUnitQuery: PaginationUnitQueryDto): Promise<Unit[]> {
    const { subdivisionId } = paginationUnitQuery;
    const units = await this.unitRepository.find({
      where: { subdivisionId },
    });
    return units;
  }
  findOne(id: number) {
    return this.unitRepository.findOne({ where: { id } });
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return this.unitRepository.update(id, updateUnitDto);
  }

  remove(id: number) {
    return this.unitRepository.delete(id);
  }
}
