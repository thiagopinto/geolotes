import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
@Entity('users')
export class User {
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The phone of the user',
    example: '1234567890',
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: 'The isActive of the user',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'The created at of the user',
    example: '2021-01-01',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at of the user',
    example: '2021-01-01',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The roles of the user',
    example: '123 Main St, Anytown, USA',
  })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable() // Esta tabela de junção só precisa ser definida em uma das entidades
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (typeof this.password === 'string' && this.password.trim() !== '') {
      this.password = await (
        bcrypt as {
          hash: (password: string, saltOrRounds: number) => Promise<string>;
        }
      ).hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
