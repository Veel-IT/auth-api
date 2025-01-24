import { User } from '@prisma/client';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiEndpoint } from '../common/utils/documentation';
import { JwtAuthGuard, LocalAuthGuard } from '../common/security/guards';
import { CurrentUser } from '../common/decorators';

import { UserDto } from '../user/dtos/user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: `\n
    InvalidBodyException:
      Name is not correct (a-zA-Z), or too short (min: 2), or too long (max: 40)
      Name cannot be empty
      Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)
      Username cannot be empty
      Password is too short (min: 8)
      Password is too long (max: 50)
      The password must include at least 1 digit and 1 letter
      Password cannot be empty
      Hash cannot be empty
      Username cannot be empty
                  
    AlreadyRegisteredException:
      User is already registered`,
  })
  @ApiTooManyRequestsResponse({
    description: `\n
    TooManyActionsException:
      Too many actions. Try later`,
  })
  @ApiEndpoint({
    summary: 'Register new user',
  })
  @Post('register')
  async register(@Body() body: UserDto) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      Unauthorized`,
  })
  @ApiBody({
    type: UserDto,
  })
  @ApiEndpoint({
    summary: 'Login to the user account',
    guards: LocalAuthGuard,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: `\n
    UnauthorizedException:
      Unauthorized`,
  })
  @ApiEndpoint({
    summary: 'Get user information',
    guards: JwtAuthGuard,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
