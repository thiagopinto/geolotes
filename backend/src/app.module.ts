import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgDataSourceOptions } from './database/pg.sources';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { SubdivisionModule } from './subdivision/subdivision.module';
import { UnitModule } from './unit/unit.module';
import { CustomerModule } from './customer/customer.module';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './payment/payment.module';
import { SicoobModule } from './sicoob/sicoob.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...PgDataSourceOptions, autoLoadEntities: true }),
    UserModule,
    RoleModule,
    AuthModule,
    SubdivisionModule,
    UnitModule,
    CustomerModule,
    ContractModule,
    PaymentModule,
    SicoobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
