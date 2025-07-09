import { HttpStatus } from "@nestjs/common";
import { Response } from "express";

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
  requestId?: string;
}

export const createResponse = <T = any>(
  res: Response,
  status: HttpStatus,
  message: string,
  data?: T,
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    statusCode: status,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: res.req.url,
  };

  // Add request ID if available for tracing
  if (res.req.headers["x-request-id"]) {
    response.requestId = res.req.headers["x-request-id"] as string;
  }

  return res.status(status).json(response);
};

// Legacy support - keep for backward compatibility but mark as deprecated
/** @deprecated Use createResponse instead */
export const iResponse = createResponse;
