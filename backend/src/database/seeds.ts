import 'dotenv/config';
import AppDataSource from './pg.sources';
import { Seed } from './interfaces/seed.interface';

// Importação automática dos seeds
import { UserSeed } from '../user/seed/user.seed';
import { RoleSeed } from '../role/seed/role.seed';

// Lista dinâmica de seeds
const seeds: Seed[] = [new UserSeed(), new RoleSeed()];

const runSeeds = async () => {
  const dataSource = await AppDataSource.initialize();
  console.log('📦 Conectado ao banco de dados para rodar seeds...');

  try {
    for (const seed of seeds) {
      await seed.run(dataSource);
    }
    console.log('✅ Todas as seeds foram executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
  } finally {
    await dataSource.destroy();
  }
};

runSeeds();
