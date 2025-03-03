//import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

//dotenv.config();
import 'dotenv/config';

export const PgDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT as string),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.ENV === 'dev',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
  //entities: [`dist/**/entities/**.entity{.ts,.js}`],
  //migrations: [`dist/database/migrations/*{.ts,.js}`],
};

const AppDataSourcePg = new DataSource(PgDataSourceOptions);

// 🔹 Inicializa o DataSource antes de exportar
AppDataSourcePg.initialize()
  .then(() => console.log('📦 Database initialized'))
  .catch((err) => console.error('❌ Error initializing database:', err));

export default AppDataSourcePg;
