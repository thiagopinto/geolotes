import { Module } from '@nestjs/common';
import { SicoobService } from './sicoob.service';
import { BoletosModule } from './boletos/boletos.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  providers: [SicoobService],
  imports: [BoletosModule, PagamentosModule],
})
export class SicoobModule {}
