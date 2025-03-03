import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Seed } from 'src/database/interfaces/seed.interface';
import { faker } from '@faker-js/faker'; // Instale: npm install @faker-js/faker --save-dev

export class UserFactory implements Seed {
    async run(dataSource: DataSource): Promise<void> {
        const userRepository = dataSource.getRepository(User);

        // Gerar usuários fakes
        const numFakes = 30; // Quantidade de usuários fakes
        const usersFaker: any[] = [];
        for (let i = 0; i < numFakes; i++) {
            const fakeUser = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.phone.number(), // Ou um gerador de telefone mais específico para o Brasil
                isActive: faker.datatype.boolean(),
                password: 'Senh@123',
            };
            usersFaker.push(fakeUser);
        }

        const users = userRepository.create(usersFaker);
        await userRepository.save(users);
        console.log(`✅ Seed de usuários inserida com sucesso! ${users.length} usuários criados.`);
    }
}