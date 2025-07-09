import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  PaginationDto,
  PaginatedResponse,
} from "src/common/dto/pagination.dto";
import { CacheService } from "src/modules/cache/cache.service";
import { UrlCodeGenerator } from "src/utils/url-code-generator";
import { Url } from "../../entities/url.entity";
import { NewUrlDTO } from "./dto/new-url.dto";
import { UpdateUrlDTO } from "./dto/update-url.dto";

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly cacheService: CacheService,
  ) {}

  async createUrl(newUrlDTO: NewUrlDTO, userId?: string): Promise<Url> {
    try {
      let urlCode: string;

      if (newUrlDTO.urlCode) {
        // Check if custom code is available
        const existingUrl = await this.urlModel.findOne({
          urlCode: newUrlDTO.urlCode,
        });
        if (existingUrl) {
          throw new HttpException(
            "URL Code is already taken!",
            HttpStatus.BAD_REQUEST,
          );
        }
        urlCode = newUrlDTO.urlCode;
      } else {
        // Generate unique code with collision handling
        urlCode = await UrlCodeGenerator.generateUniqueCode(
          async (code: string) => {
            const exists = await this.urlModel.findOne({ urlCode: code });
            return !!exists;
          },
        );
      }

      const urlData = {
        ...newUrlDTO,
        urlCode,
        userId: userId || null,
        clickCount: 0,
        lastAccessed: new Date(),
      };

      const newUrl = new this.urlModel(urlData);
      const savedUrl = await newUrl.save();

      // Cache the new URL for faster access
      await this.cacheService.setUrl(urlCode, {
        longUrl: savedUrl.longUrl,
        clickCount: savedUrl.clickCount,
        lastAccessed: savedUrl.lastAccessed,
      });

      // Invalidate user stats cache
      if (userId) {
        await this.cacheService.invalidateUserCache(userId);
      }

      this.logger.log(
        `URL created and cached: ${urlCode} -> ${newUrlDTO.longUrl}`,
      );
      return savedUrl;
    } catch (error) {
      this.logger.error(`Error creating URL: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLongUrl(
    urlCode: string,
  ): Promise<{ url: string; clickCount: number }> {
    try {
      // Try to get from cache first
      const cachedUrl = await this.cacheService.getUrl(urlCode);

      if (cachedUrl) {
        // Update click count in background (don't await to keep response fast)
        this.incrementClickCount(urlCode);

        return {
          url: cachedUrl.longUrl,
          clickCount: cachedUrl.clickCount + 1,
        };
      }

      // If not in cache, get from database
      const url = await this.urlModel.findOne({ urlCode });
      if (!url) {
        throw new NotFoundException("URL not found.");
      }

      // Cache the URL for future requests
      await this.cacheService.setUrl(urlCode, {
        longUrl: url.longUrl,
        clickCount: url.clickCount,
        lastAccessed: url.lastAccessed,
      });

      // Increment click count
      const newClickCount = url.clickCount + 1;
      await this.urlModel.updateOne(
        { urlCode },
        {
          $inc: { clickCount: 1 },
          $set: { lastAccessed: new Date() },
        },
      );

      // Update cache with new click count
      await this.cacheService.setUrl(urlCode, {
        longUrl: url.longUrl,
        clickCount: newClickCount,
        lastAccessed: new Date(),
      });

      this.logger.log(`URL accessed: ${urlCode} (clicks: ${newClickCount})`);
      return {
        url: url.longUrl,
        clickCount: newClickCount,
      };
    } catch (error) {
      this.logger.error(`Error retrieving URL: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async incrementClickCount(urlCode: string): Promise<void> {
    try {
      await this.urlModel.updateOne(
        { urlCode },
        {
          $inc: { clickCount: 1 },
          $set: { lastAccessed: new Date() },
        },
      );

      // Update cache with new click count
      const cachedUrl = await this.cacheService.getUrl(urlCode);
      if (cachedUrl) {
        await this.cacheService.setUrl(urlCode, {
          ...cachedUrl,
          clickCount: cachedUrl.clickCount + 1,
          lastAccessed: new Date(),
        });
      }
    } catch (error) {
      this.logger.error(`Error incrementing click count: ${error.message}`);
    }
  }

  async getAllUrls(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Url>> {
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

      const [urls, total] = await Promise.all([
        this.urlModel
          .find()
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .lean(),
        this.urlModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: urls,
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
      this.logger.error(`Error retrieving URLs: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUrlsByUserId(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Url>> {
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

      const [urls, total] = await Promise.all([
        this.urlModel
          .find({ userId })
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .lean(),
        this.urlModel.countDocuments({ userId }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: urls,
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
        `Error retrieving user URLs: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUrl(id: string, userId?: string): Promise<void> {
    try {
      const filter = userId ? { _id: id, userId } : { _id: id };
      const result = await this.urlModel.findOneAndDelete(filter);

      if (!result) {
        throw new NotFoundException("URL not found or access denied.");
      }

      this.logger.log(`URL deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting URL: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUrl(
    id: string,
    updateUrlDTO: UpdateUrlDTO,
    userId?: string,
  ): Promise<Url> {
    try {
      const filter = userId ? { _id: id, userId } : { _id: id };
      const existingUrl = await this.urlModel.findOne(filter);

      if (!existingUrl) {
        throw new NotFoundException("URL not found or access denied.");
      }

      const updateData: any = {};

      if (updateUrlDTO.newLongUrl) {
        updateData.longUrl = updateUrlDTO.newLongUrl;
      }

      if (updateUrlDTO.newUrlCode) {
        // Check if new code is available
        const codeExists = await this.urlModel.findOne({
          urlCode: updateUrlDTO.newUrlCode,
          _id: { $ne: id },
        });

        if (codeExists) {
          throw new HttpException(
            "URL Code is already taken!",
            HttpStatus.BAD_REQUEST,
          );
        }
        updateData.urlCode = updateUrlDTO.newUrlCode;
      }

      const updatedUrl = await this.urlModel.findOneAndUpdate(
        filter,
        updateData,
        { new: true },
      );

      this.logger.log(`URL updated: ${id}`);
      return updatedUrl;
    } catch (error) {
      this.logger.error(`Error updating URL: ${error.message}`, error.stack);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUrlStats(userId?: string): Promise<{
    totalUrls: number;
    totalClicks: number;
    averageClicksPerUrl: number;
  }> {
    try {
      const filter = userId ? { userId } : {};

      const stats = await this.urlModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalUrls: { $sum: 1 },
            totalClicks: { $sum: "$clickCount" },
            averageClicksPerUrl: { $avg: "$clickCount" },
          },
        },
      ]);

      return (
        stats[0] || { totalUrls: 0, totalClicks: 0, averageClicksPerUrl: 0 }
      );
    } catch (error) {
      this.logger.error(
        `Error retrieving URL stats: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
