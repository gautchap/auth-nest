import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/CreateUser.dto';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [AuthController],
      providers: [PrismaService, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should throw error if email is not an email or if is empty', async () => {
    const user = {
      email: 'blabla',
      username: 'test',
      password: 'test',
    };

    const dto = plainToInstance(CreateUserDto, user);
    const errors = await validate(dto);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain(`email must be an email`);

    const userWithoutEmail = {
      email: '',
      username: 'test',
      password: 'testing',
    };

    const dtoWithoutEmail = plainToInstance(CreateUserDto, userWithoutEmail);
    const errorsEmail = await validate(dtoWithoutEmail);

    expect(errorsEmail.length).not.toBe(0);
    expect(JSON.stringify(errorsEmail)).toContain(`email should not be empty`);
  });

  it('should throw error if password is shorter than 6 caracters or if is empty', async () => {
    const user = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
    };

    const dto = plainToInstance(CreateUserDto, user);
    const errors = await validate(dto);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain(
      `password must be longer than or equal to 6 characters`,
    );

    const userWithoutPass = {
      email: 'test@test.com',
      username: 'test',
      password: '',
    };

    const dtoWithoutPass = plainToInstance(CreateUserDto, userWithoutPass);
    const errorsPass = await validate(dtoWithoutPass);

    expect(errorsPass.length).not.toBe(0);
    expect(JSON.stringify(errorsPass)).toContain(
      `password should not be empty`,
    );
  });
  it('should throw error if username is empty', async () => {
    const user = {
      email: 'test@test.com',
      username: '',
      password: 'test',
    };

    const dto = plainToInstance(CreateUserDto, user);
    const errors = await validate(dto);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain(`username should not be empty`);
  });
});
