import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LogUserDto } from './dto/LogUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { totp } from 'otplib';
import { ResetPasswordConfirmationDto } from './dto/ResetPasswordConfirmation.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
  ) {}

  private async isUserExist(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async CreateUser(CreateUser: CreateUserDto) {
    const { email, username, password } = CreateUser;

    const isEmailExist = await this.isUserExist(email);

    if (isEmailExist) throw new ConflictException('Email already exist');

    const isUserExist = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (isUserExist) throw new ConflictException('User already exist');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, username: user.username };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });

    await this.mailService.sendMailConfirmation(email, token);

    return user;
  }

  async CreateUserConfirm(token: string) {
    const payload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    await this.prismaService.user.update({
      where: {
        id: payload.sub,
        username: payload.username,
      },
      data: {
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
    });

    return { data: 'Email verified' };
  }

  async LogUser(LogUser: LogUserDto) {
    const { email, password } = LogUser;

    const user = await this.isUserExist(email);

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const isVerified = user.emailVerified;

    if (!isVerified) throw new UnauthorizedException('Email not verified');

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(
        { payload },
        { expiresIn: '60s' },
      ),
    };
  }

  async ResetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const user = await this.isUserExist(email);

    if (!user) throw new NotFoundException('User not found');

    const time = 60 * 15;

    totp.options = { digits: 6, step: time };

    const token = totp.generate(process.env.TOTP_SECRET);

    const url = `http://localhost:3000/auth/reset-password-confirmation`;

    await this.mailService.sendResetPassword(email, url, token, time);

    return { data: 'Reset Password Email Sent' };
  }

  async ResetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, code, password } = resetPasswordConfirmationDto;
    const user = await this.isUserExist(email);

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = totp.check(code, process.env.TOTP_SECRET);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid code');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { data: 'Password updated' };
  }
}
