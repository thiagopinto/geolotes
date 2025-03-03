import 'dotenv/config';
import AppDataSource from './pg.sources';
import { Seed } from './interfaces/seed.interface';

// Importação automática dos seeds
import { UserFactory } from '../user/seed/user.factory';

// Lista dinâmica de factory
const factory: Seed[] = [new UserFactory()];

const runfactory = async () => {
  const dataSource = await AppDataSource.initialize();
  console.log('📦 Conectado ao banco de dados para rodar factory...');

  try {
    for (const seed of factory) {
      await seed.run(dataSource);
    }
    console.log('✅ Todas as factory foram executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar factory:', error);
  } finally {
    await dataSource.destroy();
  }
};

runfactory();
