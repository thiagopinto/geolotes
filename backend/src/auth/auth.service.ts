import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginAuthDto: LoginAuthDto): Promise<string> {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'createdAt', 'isActive', 'password'],
      relations: ['roles'],
    });

    if (!user || !(await user.validatePassword(password)) || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        roles: user.roles,
      },
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['roles'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      if (payload.email !== user.email) {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token' + error);
    }
  }

  async refreshToken(payload: User): Promise<{
    accessToken: string;
    user: {
      id: number | string | undefined;
      name: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      isActive: boolean;
      roles: any;
    };
    expiresIn: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const newPayload = {
      sub: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        roles: user.roles,
      },
    };

    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60;

    const accessToken = await this.jwtService.signAsync(newPayload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        roles: user.roles,
      },
      expiresIn,
    };
  }
}
