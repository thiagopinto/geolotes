import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Seed } from 'src/database/interfaces/seed.interface';

export class RoleSeed implements Seed {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    // Verifica se já existem registros para evitar duplicação
    if (await roleRepository.count()) {
      console.log('🚀 Perfis já inseridos, pulando seed...');
      return;
    }

    const roles = roleRepository.create([
      {
        name: 'Administrador',
        longName: 'admin',
      },
      {
        name: 'Cliente',
        longName: 'client',
      },
    ]);

    await roleRepository.save(roles);
    console.log('✅ Seed de Perfis inserida com sucesso!');
  }
}
