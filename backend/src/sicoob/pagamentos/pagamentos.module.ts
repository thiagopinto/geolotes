import { Module } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';

@Module({
  providers: [PagamentosService],
})
export class PagamentosModule {}
