import { ApiProperty } from "@nestjs/swagger";
import { Url } from "src/entities/url.entity";

export class PaginatedUrlResponseDto {
  @ApiProperty({
    description: "Array of URLs",
    type: [Url],
  })
  data: Url[];

  @ApiProperty({
    description: "Pagination metadata",
    type: Object,
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
