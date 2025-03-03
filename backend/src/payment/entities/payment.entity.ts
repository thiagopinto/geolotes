import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Payment {
  @ApiProperty({ description: 'The unique identifier of the payment' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, (contract) => contract.payments)
  contract: Contract;

  @ApiProperty({ description: 'The due date of the payment' })
  @Column()
  dueDate: Date;

  @ApiProperty({ description: 'The amount of the payment' })
  @Column()
  amount: number;

  @ApiProperty({ description: 'Whether the payment has been paid' })
  @Column({ default: false })
  paid: boolean;

  @ApiProperty({ description: 'The date the payment was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date the payment was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
