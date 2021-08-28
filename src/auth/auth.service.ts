import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(user_name: string, pass_word: string): Promise<any> {
    const user = await this.usersService.findOne({
      where: { user_name: user_name },
    });
    console.log(user);

    if (user && user.pass_word === pass_word) {
      const { pass_word, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
