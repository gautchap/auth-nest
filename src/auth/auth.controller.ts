import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LogUserDto } from './dto/LogUser.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ResetPasswordConfirmationDto } from './dto/ResetPasswordConfirmation.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  CreateUser(@Body() CreateUser: CreateUserDto) {
    return this.authService.CreateUser(CreateUser);
  }

  @Get('signup-confirmation')
  CreateUserConfirm(@Query('token') token: string) {
    return this.authService.CreateUserConfirm(token);
  }

  @Post('login')
  LogUser(@Body() LogUser: LogUserDto) {
    return this.authService.LogUser(LogUser);
  }

  @Post('reset-password')
  ResetPassword(@Body() ResetPassword: ResetPasswordDto) {
    return this.authService.ResetPassword(ResetPassword);
  }

  @Post('reset-password-confirmation')
  ResetPasswordConfirmation(
    @Body() ResetPasswordConfirmation: ResetPasswordConfirmationDto,
  ) {
    return this.authService.ResetPasswordConfirmation(
      ResetPasswordConfirmation,
    );
  }
}
