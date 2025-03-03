import { Module } from '@nestjs/common';
import { BoletosService } from './boletos.service';

@Module({
  providers: [BoletosService],
})
export class BoletosModule {}
