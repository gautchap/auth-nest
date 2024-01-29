import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LogUserDto } from './dto/LogUser.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ResetPasswordConfirmationDto } from './dto/ResetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/DeleteAccount.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  CreateUser(@Body() CreateUser: CreateUserDto) {
    return this.authService.CreateUser(CreateUser);
  }

  @Get('signup-confirmation')
  @Redirect('https://google.com')
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

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getUser(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  deleteAccount(
    @Req() request: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.authService.DeleteAccount(
      request.user['id'],
      request.user['email'],
      deleteAccountDto,
    );
  }
}
