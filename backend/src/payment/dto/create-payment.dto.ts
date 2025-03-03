import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePaymentDto {
  @ApiProperty({ description: 'The contract ID' })
  @IsNotEmpty()
  @IsNumber()
  contractId: number;

  @ApiProperty({ description: 'The due date of the payment' })
  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ description: 'The amount of the payment' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Whether the payment has been paid' })
  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;
}
