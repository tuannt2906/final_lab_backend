import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { HashPass } from '@/helpers/utils';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone } = createUserDto;
    // CheckEmail
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} is already existed!`);
    }
    // HashPassword
    const hashPass = await HashPass(password);
    // Create User
    const user = await this.userModel.create({
      name,
      email,
      password: hashPass, // Sửa lỗi chính tả từ `hassPass` thành `hashPass`
      phone,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const skip = (current - 1) * pageSize;

    const [results, totalItems] = await Promise.all([
      this.userModel
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .select('-password')
        .sort(sort as any),
      (await this.userModel.find(filter)).length,
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByUser(name: string) {
    return await this.userModel.findOne({ name });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto, _id: 'test' },
    );
  }

  async remove(_id: string) {
    // CheckID
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Id is invalid!');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    // CheckEmail
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} is already existed!`);
    }
    // HashPassword
    const hashPass = await HashPass(password);
    const codeID = uuidv4();
    // Create User
    const user = await this.userModel.create({
      name,
      email,
      password: hashPass,
      isActive: false,
      codeId: codeID,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    //SendEmail
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your account', // Subject line
      text: 'welcome', // plaintext body
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeID,
      },
    });

    return {
      _id: user._id,
    };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException('Code is invalid/expired!');
    }

    //Check expired code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //Valid -> update user
      await this.userModel.updateOne(
        { _id: data._id },
        {
          isActive: true,
        },
      );
    } else {
      throw new BadRequestException('Code is invalid/expired!');
    }
    return { isBeforeCheck };
  }
}
