import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LogUserDto } from './dto/LogUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  CreateUser(@Body() CreateUser: CreateUserDto) {
    return this.authService.CreateUser(CreateUser);
  }

  @Post('login')
  LogUser(@Body() LogUser: LogUserDto) {
    return this.authService.LogUser(LogUser);
  }
}
