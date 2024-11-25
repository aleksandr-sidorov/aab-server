import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationFormComponent } from './registration-form.component';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('RegistrationFormComponent', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', {
      userRegister: of({
        status: 'success',
        message: 'Registration data received successfully',
      }),
    });

    await TestBed.configureTestingModule({
      imports: [
        RegistrationFormComponent,
        NoopAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    TestBed.overrideProvider(UserService, { useValue: userServiceSpy });

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get "Field is required" errors on empty form', () => {
    expect(component).toBeTruthy();

    component.registrationForm.markAsTouched();

    expect(component.usernameErrors).toEqual(['Field is required']);
    expect(component.emailErrors).toEqual(['Field is required']);
    expect(component.passwordErrors).toEqual(['Field is required']);
    expect(component.confirmPasswordErrors).toEqual(['Field is required']);
    expect(component.passwordMatchErrors).toEqual([]);
  });

  it('should get minimum length errors on username and email fields if values does not meet criteria', () => {
    const limitedFormData = {
      username: 'a',
      email: 'test@email.me',
      password: 'a',
      confirmPassword: 'a',
      fullname: '',
    };
    component.registrationForm.setValue(limitedFormData);

    expect(component.usernameErrors).toEqual([
      'Field must be at least 3 characters long',
    ]);
    expect(component.emailErrors).toEqual([]);
    expect(component.passwordErrors).toEqual([
      'Field must be at least 8 characters long',
    ]);
    expect(component.confirmPasswordErrors).toEqual([]);
    expect(component.passwordMatchErrors).toEqual([]);
  });

  it('should get "Field must be a valid email" error on email field if value is not a valid email', () => {
    const invalidEmailFormData = {
      username: 'username',
      email: 'testemail.me',
      password: 'password',
      confirmPassword: 'password',
      fullname: 'John Doe',
    };
    component.registrationForm.setValue(invalidEmailFormData);

    expect(component.usernameErrors).toEqual([]);
    expect(component.emailErrors).toEqual(['Invalid email address']);
    expect(component.passwordErrors).toEqual([]);
    expect(component.confirmPasswordErrors).toEqual([]);
    expect(component.passwordMatchErrors).toEqual([]);
  });

  it('should get "Passwords do not match" error on confirmPassword field if password and confirmPassword do not match', () => {
    const mismatchedPasswordFormData = {
      username: 'username',
      email: 'test@email.me',
      password: 'password',
      confirmPassword: 'password1',
      fullname: 'John Doe',
    };
    component.registrationForm.setValue(mismatchedPasswordFormData);

    expect(component.usernameErrors).toEqual([]);
    expect(component.emailErrors).toEqual([]);
    expect(component.passwordErrors).toEqual([]);
    expect(component.confirmPasswordErrors).toEqual([]);
    expect(component.passwordMatchErrors).toEqual(['Passwords do not match']);
  });

  it('should not be able to submit invalid form', async () => {
    expect(component).toBeTruthy();

    const testFormValue = {
      username: 'username',
      email: 'test@email.me',
      password: 'pa$$word',
      confirmPassword: 'pa$$word',
      fullname: 'John Doe',
    };

    component.registrationForm.setValue(testFormValue);
    component.onSubmit();
    expect(userServiceSpy.userRegister).toHaveBeenCalledTimes(1);

    expect(component.backendError()).toBeNull();
    expect(component.backendSuccessMessage()).toEqual(
      'Registration data received successfully',
    );
  });

  it('should not be able to call userService.userRegister if form does not have all necessary field values', async () => {
    expect(component).toBeTruthy();
    component.onSubmit();
    expect(userServiceSpy.userRegister).toHaveBeenCalledTimes(0);

    expect(component.backendError()).toBeNull();
    expect(component.backendSuccessMessage()).toBeNull();
  });
});
