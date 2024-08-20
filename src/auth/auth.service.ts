import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { ComparePass } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await ComparePass(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Username/Password is invalid!');
    }
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
