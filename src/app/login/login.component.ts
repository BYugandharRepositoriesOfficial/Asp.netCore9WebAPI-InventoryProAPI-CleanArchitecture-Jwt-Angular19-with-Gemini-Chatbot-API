import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const remember = localStorage.getItem('rememberMe');

    if (remember === 'true') {
      this.rememberMe = true;
      this.username = localStorage.getItem('username') || '';
    }

  }

  login(): void {

    const loginData = {
      userName: this.username,
      password: this.password
    };

    console.log(loginData);

    this.authService.login(loginData).subscribe({

      next: (response: any) => {

        // Save JWT Token
        localStorage.setItem('token', response.token);

        // Remember Me
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('username', this.username);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('username');
        }

        alert('Login Successful');

        this.router.navigate(['/Dashboard']);

      },

      error: (err) => {
        console.error(err);
        alert('Login Failed');
      }

    });

  }

}