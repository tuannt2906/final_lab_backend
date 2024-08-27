import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { ComparePass } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUser(username);
    if (!user) return null;
    const isValidPassword = await ComparePass(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return this.usersService.handleRegister(registerDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return this.usersService.handleActive(data);
  };

  retryActive = async (data: string) => {
    return this.usersService.retryActive(data);
  };

  retryPassword = async (data: string) => {
    return this.usersService.retryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return this.usersService.changePassword(data);
  };
}
