import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

export interface UserServiceRegisterPayload {
  username: string;
  email: string;
  password: string;
  fullname?: string;
}

export interface UserServiceRegisterResponse {
  status: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly userServiceUrl = environment.serviceUrl;
  constructor(private http: HttpClient) {}

  userRegister(userPayload: UserServiceRegisterPayload) {
    return this.http.post<UserServiceRegisterResponse>(
      `${this.userServiceUrl}/register`,
      userPayload,
    );
  }
}
