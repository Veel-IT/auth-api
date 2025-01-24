import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserMapper {
  getUsers(users: User[]) {
    return users.map((user) => this.getUser(user));
  }

  getUser(user: User) {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
