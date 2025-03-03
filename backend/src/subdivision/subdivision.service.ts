import { Injectable } from '@nestjs/common';
import { CreateSubdivisionDto } from './dto/create-subdivision.dto';
import { UpdateSubdivisionDto } from './dto/update-subdivision.dto';
import { Subdivision } from './entities/subdivision.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';

@Injectable()
export class SubdivisionService {
  constructor(
    @InjectRepository(Subdivision)
    private subdivisionRepository: Repository<Subdivision>,
  ) {}

  async create(createSubdivisionDto: CreateSubdivisionDto) {
    const subdivision = this.subdivisionRepository.create(createSubdivisionDto);
    return await this.subdivisionRepository.save(subdivision);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Subdivision>> {
    const {
      page = 1,
      perPage = 10,
      orderBy = 'id',
      order = 'desc',
    } = paginationQuery;
    const [subdivisions, total] = await this.subdivisionRepository.findAndCount(
      {
        skip: (page - 1) * perPage,
        take: perPage,
        order: { [orderBy]: order },
      },
    );
    return new PaginationResponseDto(subdivisions, total, page, perPage);
  }

  async findOne(id: number) {
    return await this.subdivisionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSubdivisionDto: UpdateSubdivisionDto) {
    await this.subdivisionRepository.update(id, updateSubdivisionDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.subdivisionRepository.delete(id);
  }
}
