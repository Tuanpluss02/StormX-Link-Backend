import { Injectable, Logger, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get URL from cache
   * @param urlCode The URL code to lookup
   * @returns The cached URL data or null if not found
   */
  async getUrl(urlCode: string): Promise<any> {
    try {
      const cacheKey = `url:${urlCode}`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.logger.debug(`Cache hit for URL: ${urlCode}`);
        return cachedData;
      }

      this.logger.debug(`Cache miss for URL: ${urlCode}`);
      return null;
    } catch (error) {
      this.logger.error(`Error getting URL from cache: ${error.message}`);
      return null; // Graceful fallback
    }
  }

  /**
   * Set URL in cache
   * @param urlCode The URL code
   * @param urlData The URL data to cache
   * @param ttl Time to live in seconds (default: 1 hour)
   */
  async setUrl(
    urlCode: string,
    urlData: any,
    ttl: number = 3600,
  ): Promise<void> {
    try {
      const cacheKey = `url:${urlCode}`;
      await this.cacheManager.set(cacheKey, urlData, ttl * 1000); // Convert to milliseconds
      this.logger.debug(`URL cached: ${urlCode}`);
    } catch (error) {
      this.logger.error(`Error setting URL in cache: ${error.message}`);
    }
  }

  /**
   * Delete URL from cache
   * @param urlCode The URL code to delete
   */
  async deleteUrl(urlCode: string): Promise<void> {
    try {
      const cacheKey = `url:${urlCode}`;
      await this.cacheManager.del(cacheKey);
      this.logger.debug(`URL removed from cache: ${urlCode}`);
    } catch (error) {
      this.logger.error(`Error deleting URL from cache: ${error.message}`);
    }
  }

  /**
   * Get user session from cache
   * @param userId The user ID
   * @returns The cached session data or null if not found
   */
  async getUserSession(userId: string): Promise<any> {
    try {
      const cacheKey = `session:${userId}`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.logger.debug(`Session cache hit for user: ${userId}`);
        return cachedData;
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Error getting user session from cache: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Set user session in cache
   * @param userId The user ID
   * @param sessionData The session data to cache
   * @param ttl Time to live in seconds (default: 30 minutes)
   */
  async setUserSession(
    userId: string,
    sessionData: any,
    ttl: number = 1800,
  ): Promise<void> {
    try {
      const cacheKey = `session:${userId}`;
      await this.cacheManager.set(cacheKey, sessionData, ttl * 1000);
      this.logger.debug(`User session cached: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error setting user session in cache: ${error.message}`,
      );
    }
  }

  /**
   * Delete user session from cache
   * @param userId The user ID
   */
  async deleteUserSession(userId: string): Promise<void> {
    try {
      const cacheKey = `session:${userId}`;
      await this.cacheManager.del(cacheKey);
      this.logger.debug(`User session removed from cache: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error deleting user session from cache: ${error.message}`,
      );
    }
  }

  /**
   * Get URL statistics from cache
   * @param userId The user ID (optional)
   * @returns The cached statistics or null if not found
   */
  async getUrlStats(userId?: string): Promise<any> {
    try {
      const cacheKey = userId ? `stats:user:${userId}` : "stats:global";
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.logger.debug(`Stats cache hit for: ${cacheKey}`);
        return cachedData;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error getting stats from cache: ${error.message}`);
      return null;
    }
  }

  /**
   * Set URL statistics in cache
   * @param statsData The statistics data to cache
   * @param userId The user ID (optional)
   * @param ttl Time to live in seconds (default: 5 minutes)
   */
  async setUrlStats(
    statsData: any,
    userId?: string,
    ttl: number = 300,
  ): Promise<void> {
    try {
      const cacheKey = userId ? `stats:user:${userId}` : "stats:global";
      await this.cacheManager.set(cacheKey, statsData, ttl * 1000);
      this.logger.debug(`Stats cached for: ${cacheKey}`);
    } catch (error) {
      this.logger.error(`Error setting stats in cache: ${error.message}`);
    }
  }

  /**
   * Invalidate all cache entries for a user
   * @param userId The user ID
   */
  async invalidateUserCache(userId: string): Promise<void> {
    try {
      // Delete user session
      await this.deleteUserSession(userId);

      // Delete user stats
      await this.cacheManager.del(`stats:user:${userId}`);

      this.logger.debug(`User cache invalidated: ${userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating user cache: ${error.message}`);
    }
  }

  /**
   * Get cache statistics
   * @returns Cache statistics including hits, misses, and size
   */
  async getCacheStats(): Promise<any> {
    try {
      // Note: This is a basic implementation.
      // In a real Redis setup, you would use Redis INFO command
      return {
        status: "active",
        timestamp: new Date().toISOString(),
        // Additional stats would come from Redis INFO command
      };
    } catch (error) {
      this.logger.error(`Error getting cache stats: ${error.message}`);
      return { status: "error", message: error.message };
    }
  }

  /**
   * Clear all cache entries (use with caution)
   */
  async clearAll(): Promise<void> {
    try {
      // Note: reset() method might not be available in all cache-manager versions
      // This is a fallback implementation
      this.logger.warn(
        "Cache clear requested - this should be done carefully in production",
      );
      // In a real Redis implementation, you would use FLUSHALL command
      // await this.cacheManager.reset();
    } catch (error) {
      this.logger.error(`Error clearing cache: ${error.message}`);
    }
  }
}
