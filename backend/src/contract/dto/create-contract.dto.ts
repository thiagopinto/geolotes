import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ description: 'The customer ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'List of unit IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1) // 🔥 Pelo menos 1 unidade é obrigatória
  unitIds: number[];

  @ApiProperty({ description: 'Total price', example: 100000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Number of installments', example: 12 })
  @IsNotEmpty()
  @IsNumber()
  installments: number;
}
