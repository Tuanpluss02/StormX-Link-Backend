import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({
    description: "Page number",
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Number of items per page",
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: "Sort field",
    default: "createdAt",
    required: false,
  })
  @IsOptional()
  sortBy?: string = "createdAt";

  @ApiProperty({
    description: "Sort order",
    default: "desc",
    enum: ["asc", "desc"],
    required: false,
  })
  @IsOptional()
  sortOrder?: "asc" | "desc" = "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
