import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Customer {
  @ApiProperty({
    description: 'The id of the customer',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The full name of the customer',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The document of the customer',
    example: '1234567890',
  })
  @Column({ unique: true })
  document: string; // CPF ou CNPJ

  @ApiProperty({
    description: 'The email of the customer',
    example: 'john.doe@example.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'The phone of the customer',
    example: '1234567890',
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: 'The address of the customer',
    example: 'Rua A',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'The number of the customer',
    example: '123',
  })
  @Column()
  number: string;

  @ApiProperty({
    description: 'The neighborhood of the customer',
    example: 'Centro',
  })
  @Column()
  neighborhood: string;

  @ApiProperty({
    description: 'The city of the customer',
    example: 'Teresina',
  })
  @Column()
  city: string;

  @ApiProperty({
    description: 'The state of the customer',
    example: 'PI',
  })
  @Column()
  state: string;

  @ApiProperty({
    description: 'The postal code of the customer',
    example: '12345-678',
  })
  @Column()
  postalCode: string;

  @ApiProperty({
    description: 'The created at of the customer',
    example: '2021-01-01',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at of the customer',
    example: '2021-01-01',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Contract, (contract) => contract.customer)
  contracts: Contract[];
}
