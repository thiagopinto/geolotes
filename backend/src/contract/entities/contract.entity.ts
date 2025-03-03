import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Unit } from '../../unit/entities/unit.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Contract {
  @ApiProperty({
    description: 'The id of the contract',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.contracts)
  customer: Customer;

  @OneToMany(() => Unit, (unit) => unit.contract, { cascade: true })
  units: Unit[]; // 🔥 Um contrato pode ter várias unidades

  @Column()
  price: number; // Valor total do contrato

  @ApiProperty({
    description: 'The number of installments of the contract',
    example: 1,
  })
  @Column()
  installments: number; // Número de parcelas

  @ApiProperty({
    description: 'The created at of the contract',
    example: '2021-01-01',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at of the contract',
    example: '2021-01-01',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.contract)
  payments: Payment[];
}
