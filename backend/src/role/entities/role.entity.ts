import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity('roles')
export class Role {
  @ApiProperty({ description: 'The id of the role' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the role' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The long name of the role' })
  @Column()
  longName: string;

  @ApiProperty({ description: 'The created at date of the role' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The updated at date of the role' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'The users of the role' })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
