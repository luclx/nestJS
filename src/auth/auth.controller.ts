import { Controller, Get, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: String
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have provided an invalid username/password.',
    type: String
  })
  @ApiBody({
    type: LoginDto
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: String
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: String
  })
  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkAuth(@Request() req): string {
    return req.user;
  }
}
