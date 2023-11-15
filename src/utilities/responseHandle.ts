import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const iResponse = (status: HttpStatus, message: string, data?: any) => {
  const response = {
    statusCode: status,
    message: message,
    data: data,
  };
  return response;
};

