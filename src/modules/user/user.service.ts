import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  PaginationDto,
  PaginatedResponse,
} from "src/common/dto/pagination.dto";
import { User } from "src/entities/user.entity";
import { PasswordUtil } from "src/utils/password-util";
import { ValidationUtil } from "src/utils/validation.util";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(username: string, password: string): Promise<User> {
    try {
      // Validate and sanitize input
      const sanitizedUsername = ValidationUtil.sanitizeString(username);
      ValidationUtil.validateUsername(sanitizedUsername);
      ValidationUtil.validatePassword(password);

      const userExist = await this.userModel.findOne({
        username: sanitizedUsername,
      });
      if (userExist) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await PasswordUtil.hashPassword(password);
      const newUser = new this.userModel({
        username: sanitizedUsername,
        password: hashedPassword,
        urls: [],
      });

      const savedUser = await newUser.save();
      this.logger.log(`User created: ${sanitizedUsername}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userLogin(username: string, password: string): Promise<User> {
    try {
      const sanitizedUsername = ValidationUtil.sanitizeString(username);

      const user = await this.userModel.findOne({
        username: sanitizedUsername,
      });
      if (!user) {
        throw new UnauthorizedException("Invalid username or password");
      }

      const checkPassword = await PasswordUtil.comparePassword(
        password,
        user.password,
      );
      if (!checkPassword) {
        throw new UnauthorizedException("Invalid username or password");
      }

      this.logger.log(`User logged in: ${sanitizedUsername}`);
      return user;
    } catch (error) {
      this.logger.error(`Error during login: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Validate new password
      ValidationUtil.validatePassword(newPassword);

      const user = await this.getUserById(id);

      const checkPassword = await PasswordUtil.comparePassword(
        oldPassword,
        user.password,
      );
      if (!checkPassword) {
        throw new UnauthorizedException("Invalid old password");
      }

      const hashedNewPassword = await PasswordUtil.hashPassword(newPassword);
      await this.userModel.findByIdAndUpdate(id, {
        password: hashedNewPassword,
      });

      this.logger.log(`Password changed for user: ${id}`);
      return { message: "Password changed successfully" };
    } catch (error) {
      this.logger.error(
        `Error changing password: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).select("-password");
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      this.logger.error(`Error retrieving user: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Partial<User>>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = paginationDto;
      const skip = (page - 1) * limit;

      const sortOptions: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === "desc" ? -1 : 1,
      };

      const [users, total] = await Promise.all([
        this.userModel
          .find()
          .select("-password -__v")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        this.userModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving users: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserStats(userId: string): Promise<{
    totalUrls: number;
    totalClicks: number;
    joinDate: Date;
    lastActive: Date;
  }> {
    try {
      const user = await this.userModel.findById(userId).populate({
        path: "urls",
        select: "clickCount createdAt lastAccessed",
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const totalUrls = user.urls.length;
      const totalClicks = user.urls.reduce(
        (sum: number, url: any) => sum + (url.clickCount || 0),
        0,
      );
      const lastActive =
        user.urls.length > 0
          ? new Date(
              Math.max(
                ...user.urls.map((url: any) =>
                  new Date(url.lastAccessed).getTime(),
                ),
              ),
            )
          : (user as any).createdAt;

      return {
        totalUrls,
        totalClicks,
        joinDate: (user as any).createdAt,
        lastActive,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving user stats: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      this.logger.log(`User deleted: ${id}`);
      return { message: "User deleted successfully" };
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
