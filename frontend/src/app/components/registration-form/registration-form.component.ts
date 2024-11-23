import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  registrationForm = new FormGroup({
    username: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(56),
      ],
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(56),
      ],
    }),
    confirmPassword: new FormControl<string>('', {
      validators: [Validators.required, this.validatePasswordMatch],
    }),
    fullname: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(private userService: UserService) {}

  validatePasswordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.parent?.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { confirmPasswordError: true };
  }

  onSubmit() {
    const { username, email, password, fullname } = this.registrationForm.value;
    if (this.registrationForm.valid && !!username && !!email && !!password) {
      this.userService
        .userRegister({ username, email, password, fullname })
        .subscribe({
          next: (response: UserServiceRegisterResponse) => {
            console.log('response', response);
            this.backendSuccessMessage.set(
              response?.status === 'success' ? response.message : null,
            );
            this.backendError.set(null);
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log('errorResponse', errorResponse);
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
}
