import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { UserService, UserServiceRegisterPayload } from './user.service';
import { environment } from '../environment';

describe('UserService', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('"userRegister" should return a payload on success', async () => {
    const userService = TestBed.inject(UserService);
    const userRegister$ = userService.userRegister({
      username: 'test',
      email: 'test@email.me',
      password: 'pa$$word',
      fullname: 'John Doe',
    });
    const registerUserPromise = firstValueFrom(userRegister$);
    const successResponse = {
      status: 'success' as const,
      message: 'Registration data received successfully',
    };
    const req = httpTesting.expectOne(`${environment.serviceUrl}/register`);
    expect(req.request.method).toBe('POST');

    req.flush(successResponse);
    expect(await registerUserPromise).toEqual(successResponse);

    httpTesting.verify();
  });

  it('"userRegister" should throw on failed request', async () => {
    const userService = TestBed.inject(UserService);
    const incompletePayload = {
      email: 'test@email.me',
    } as UserServiceRegisterPayload;
    const userRegister$ = userService.userRegister(incompletePayload);
    const registerUserPromise = firstValueFrom(userRegister$);
    const errorResponse = {
      status: 'error' as const,
      message: 'Registration data incomplete',
    };
    const req = httpTesting.expectOne(`${environment.serviceUrl}/register`);
    expect(req.request.method).toBe('POST');

    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    await expectAsync(registerUserPromise).toBeRejected();

    httpTesting.verify();
  });
});
