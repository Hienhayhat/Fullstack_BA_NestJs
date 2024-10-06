import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/util/helper';
import aqp from 'api-query-params';
import { UsersModule } from './users.module';
import { RegisterDto } from '@/auth/dto/RegisterDto-auth.dto';
import dayjs = require('dayjs')

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>,) { }

  async isExistEmail(email: string) {
    const user = await this.UserModel.exists({ email })
    if (user) return true
    else return false
  }

  async create(createCatDto: CreateUserDto): Promise<User> {
    const { name, password, phone, address, image, email } = createCatDto;
    const hashPassword = await hashPasswordHelper(password)
    const isExist = await this.isExistEmail(email);
    if (isExist === true) throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
    else {
      const createdUser = await this.UserModel.create({ name, password: hashPassword, phone, address, image, email });
      return createdUser.id;
    }

  }

  async findAll(query: string, pageSize: number, current: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current
    if (filter.pageSize) delete filter.pageSize
    if (!pageSize) pageSize = 10;
    if (!current) current = 1;
    const totalItem = (await this.UserModel.find(filter)).length;
    const totalPage = Math.ceil(totalItem / pageSize)
    const skip = (current - 1) * (pageSize)
    const Users = await this.UserModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sort as any)


    return { Users, totalItem };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { name, phone, address, image } = updateUserDto
    await this.UserModel.updateOne({ _id: updateUserDto._id }, { name, phone, address, image })

    return `This action updates a user`;
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {

      return this.UserModel.deleteOne({ _id })
      // returns null if no record found.
    } else {
      throw new BadRequestException('id is not valid')
    }


  }
  async SignWithEmail(email: string): Promise<UsersModule | undefined> {


    return await this.UserModel.findOne({ email });
  }
  async registerUser(registerDto: RegisterDto): Promise<User> {
    const { name, password, email } = registerDto;
    const hashPassword = await hashPasswordHelper(password)
    const isExist = await this.isExistEmail(email);
    if (isExist === true) throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
    else {
      const createdUser = await this.UserModel.create({
        name,
        password: hashPassword,
        email,
        isActive: false,
        codeId: Math.floor(100000 + Math.random() * 900000),
        codeExpired: dayjs().add(1, 'hour') // manipulate

      });
      return createdUser;
    }

  }
}
