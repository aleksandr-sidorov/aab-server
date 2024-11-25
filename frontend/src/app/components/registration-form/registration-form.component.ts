import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {
  UserService,
  UserServiceRegisterResponse,
} from '../../services/user.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css',
})
export class RegistrationFormComponent {
  readonly backendError = signal<string | null>(null);
  readonly backendSuccessMessage = signal<string | null>(null);

  registrationForm = new FormGroup(
    {
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),
      fullname: new FormControl('', { nonNullable: true }),
    },
    this.passwordMatchValidator,
  );

  constructor(private userService: UserService) {}

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword) {
      return password === confirmPassword
        ? null
        : { confirmPasswordError: true };
    }
    return null;
  }

  get usernameErrors() {
    const username = this.registrationForm.get('username');
    return this.mapValidationErrors(username);
  }

  get emailErrors() {
    const email = this.registrationForm.get('email');
    return this.mapValidationErrors(email);
  }

  get passwordErrors() {
    const password = this.registrationForm.get('password');
    return this.mapValidationErrors(password);
  }

  get confirmPasswordErrors() {
    const confirmPassword = this.registrationForm.get('confirmPassword');
    return this.mapValidationErrors(confirmPassword);
  }

  get passwordMatchErrors() {
    if (this.registrationForm.hasError('confirmPasswordError')) {
      return this.mapValidationErrors(this.registrationForm);
    }
    return [];
  }

  onSubmit() {
    const { username, email, password, fullname } = this.registrationForm.value;
    if (this.registrationForm.valid && !!username && !!email && !!password) {
      this.userService
        .userRegister({ username, email, password, fullname })
        .subscribe({
          next: (response: UserServiceRegisterResponse) => {
            this.backendSuccessMessage.set(
              response?.status === 'success' ? response.message : null,
            );
            this.backendError.set(null);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 0) {
              this.backendError.set(errorResponse.message);
              return;
            }
            if (
              errorResponse.error?.status === 'error' &&
              typeof errorResponse.error?.message === 'string'
            ) {
              this.backendError.set(errorResponse.error.message);
              return;
            }
            this.backendSuccessMessage.set(null);
          },
        });
    }
  }

  mapValidationErrors(control: AbstractControl | null) {
    if (!control || !control.errors || control.valid) {
      return [];
    }
    const { errors } = control;
    return Object.keys(errors).map((key) => {
      switch (key) {
        case 'required':
          return 'Field is required';
        case 'email':
          return 'Invalid email address';
        case 'minlength':
          return `Field must be at least ${errors[key].requiredLength} characters long`;
        case 'confirmPasswordError':
          return 'Passwords do not match';
        default:
          return `Field validation error: ${key}`;
      }
    });
  }
}
