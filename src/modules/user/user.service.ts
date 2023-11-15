import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { PasswordUtil } from 'src/utilities/passwordUltil';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Url.name) private urlModel: Model<Url>,
    ) {}
    async createUser(username: string, password: string): Promise<User> {
        const userExist = await this.userModel.findOne({ username });
        if (userExist) {
          throw new HttpException('User already exists', 400);
        }
        const hashedPassword = await PasswordUtil.hashPassword(password);
        const newUser = new this.userModel({
          username,
          password: hashedPassword,
        });
        return newUser.save();
      }

      
      async userLogin(username: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({ username: username });
        if (!user) {
          throw new UnauthorizedException('Invalid username or password');
        }
        const checkPassword = await PasswordUtil.comparePassword(
          password,
          user.password,
        );
        if (!checkPassword) {
          throw new UnauthorizedException('Invalid username or password');
        }
        return user;
      }


      async getUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
          throw new HttpException('User not found', 404);
        }
        return user;
      }



}
