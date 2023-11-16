import * as Express from "express";

export const iResponse = (res: Express.Response, status: number, message: string, data?: any) => {
    return res.status(status).json({
        statusCode: status,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        path: res.req.url,
    });
}
