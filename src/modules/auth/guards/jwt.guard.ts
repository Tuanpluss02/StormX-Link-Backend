// import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { JwtStrategy } from '../strategies/jwt.strategy';


// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService, private jwtStrategy: JwtStrategy
//   ) { }

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.replace('Bearer ', '');

//     if (!token) {
//       throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
//     }

//     try {
//       const decoded = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
//       request.payload = decoded;
//       return true;
//     } catch (err) {
//       throw new HttpException(err, HttpStatus.UNAUTHORIZED);
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}