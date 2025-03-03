import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Seed } from 'src/database/interfaces/seed.interface';

export class UserSeed implements Seed {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Verifica se já existem registros para evitar duplicação
    if (await userRepository.count()) {
      console.log('🚀 Usuários já inseridos, pulando seed...');
      return;
    }

    const users = userRepository.create([
      {
        name: 'Admin',
        email: 'admin@codebr.dev',
        phone: '1234567890',
        isActive: true,
        password: 'Senh@123',
      },
      {
        name: 'Thiago',
        email: 'thiago@codebr.dev',
        phone: '1234567890',
        isActive: true,
        password: 'Senh@123',
      },
    ]);

    await userRepository.save(users);
    console.log('✅ Seed de usuários inserida com sucesso!');
  }
}
