import { AuthService } from './auth.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // config
  }

  async validate(username: string, password: string): Promise<any> {
    // const user = await this.authService.validateUser(username, password);

    // if (!user) {
    //   throw new UnauthorizedException({ description: 'You have provided an invalid username/password.' });
    // }

    return null;
  }
}
