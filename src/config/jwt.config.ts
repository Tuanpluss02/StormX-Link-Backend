import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => {
  return {
    global: true,
    secret: configService.get<string>("SECRET_KEY"),
    signOptions: {
      expiresIn: configService.get<string>("ACCESS_TOKEN_EXPIRES", "1h"),
    },
  };
};

export interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}
