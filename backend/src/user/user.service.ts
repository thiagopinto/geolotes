import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { Role } from 'src/role/entities/role.entity';
import { isSafeColumnName } from 'src/common/utils/query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  private readonly allowedColumns = ['name', 'email'];

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const {
      page = 1,
      perPage = 10,
      orderBy = 'id',
      order = 'desc',
      keyword,
      keywordColumn,
    } = paginationQuery;
    const query = this.userRepository.createQueryBuilder('user');

    if (keyword && keywordColumn) {
      // Sanitizar keywordColumn para evitar injeção de SQL
      const isSafeColumn = isSafeColumnName(keywordColumn, this.allowedColumns);

      if (isSafeColumn) {
        // Adicionar a cláusula where apenas se o nome da coluna for válido
        query.where(`user.${keywordColumn} ILIKE :keyword`, {
          keyword: `%${keyword}%`,
        });
      } else {
        // Lidar com nome de coluna inválido, por exemplo, lançar um erro ou logar um aviso
        console.warn(`Nome de coluna inválido: ${keywordColumn}`);
        throw new BadRequestException(
          `Nome de coluna inválido: ${keywordColumn}`,
        ); // Lança uma exceção
      }
    }

    const [users, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .orderBy(`user.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .getManyAndCount();

    return new PaginationResponseDto(users, total, page, perPage);
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.remove(user);
  }

  async addRole(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.roles.push(role);
    return this.userRepository.save(user);
  }

  async removeRole(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = user.roles.filter((role) => role.id !== roleId);
    return this.userRepository.save(user);
  }
}
