import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
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
  backendErrors$ = new BehaviorSubject<string[]>([]);
  constructor(private userService: UserService) {}

  validatePasswordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.parent?.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { confirmPasswordError: true };
  }

  onSubmit() {
    const { username, email, password, fullname } = this.registrationForm.value;
    if (this.registrationForm.valid && !!email && !!username && !!password) {
      this.userService
        .userRegister({ username, email, password, fullname })
        .subscribe({
          next: () => {
            this.backendErrors$.next([]);
          },
          error: (response: HttpErrorResponse) => {
            if (typeof response.error.message === 'string') {
              this.backendErrors$.next([response.error.message]);
            }
          },
        });
    }
  }
}
