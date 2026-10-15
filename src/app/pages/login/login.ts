import { Component, inject, signal } from '@angular/core';
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
  private readonly auth = inject(AuthService);
  private readonly route = inject(Router);

  loginForm = new FormGroup({
    username : new FormControl('',[Validators.required]),
    password : new FormControl('',[Validators.required])
  })


  loginSubmit(){

  }


}
