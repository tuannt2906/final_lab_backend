import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { ComparePass } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

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
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return this.usersService.handleRegister(registerDto);
  };
}
