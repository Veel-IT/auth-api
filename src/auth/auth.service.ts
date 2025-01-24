import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InvalidEntityIdException } from '../common/exceptions';
import { AlreadyRegisteredException } from './exceptions';
import { UserRepository } from '../common/database/user.repository';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.find({ username });
    if (!user) {
      throw new InvalidEntityIdException('User');
    }

    const isMatch = await this.checkPassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('The password is incorrect');
    }

    delete user.password;
    return user;
  }

  async register(registerDto: UserDto) {
    const { password, ...securedUser } = registerDto;

    const user = await this.userRepository.find({
      username: securedUser.username,
    });

    if (user) throw new AlreadyRegisteredException('username');

    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.create({
      ...securedUser,
      password: hashedPassword,
    });
  }

  async login(user: User) {
    return this.getAccessToken(user.id);
  }

  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private getAccessToken(userId: string) {
    const payload = { sub: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
