import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
  getToken() {
    return process.env.MONGO_URI;
  }
}
