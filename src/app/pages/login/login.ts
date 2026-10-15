import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';


@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login { 

  loginError = signal<string | null>(null);
  showPassword = signal(false);
  isSubmitting = signal(false);
  auth = inject(AuthService);
  route = inject(Router);
  inputType = computed(() => this.showPassword() ? 'text' : 'password');


  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })


  loginSubmit():void{

    if (this.isSubmitting()) return;

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginError.set(null);
    const { username , password} = this.loginForm.getRawValue();

    this.auth.login(username, password).subscribe({
      next:(res) =>{
        if(!res.accessToken){
          this.loginError.set('Invalid username or password')
        }

        sessionStorage.setItem('token', res.accessToken);
        sessionStorage.setItem('roles', JSON.stringify(res.user.roles));
        sessionStorage.setItem('username', JSON.stringify(res.user.username));
        this.route.navigateByUrl('/orders');
      },

      error: (err) => {
        this.loginError.set(err.error?.message ?? 'Login failed. Please try again.');
      },
    })
  }

  togglePassword():void{
    this.showPassword.update(v=>!v)
  }

}
