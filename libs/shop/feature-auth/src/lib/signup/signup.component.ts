import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@org/shop/data';

@Component({
  selector: 'shop-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <h1>Create Account</h1>

        <input
          name="name"
          [(ngModel)]="name"
          placeholder="Full Name"
          required
        />

        <input
          name="email"
          [(ngModel)]="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          [(ngModel)]="password"
          type="password"
          placeholder="Password"
          required
        />

        @if (error) {
          <p class="error">{{ error }}</p>
        }

        <button type="submit">Sign Up</button>
      </form>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 70vh;
      display: grid;
      place-items: center;
    }

    .auth-card {
      width: 360px;
      padding: 32px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 8px 24px #0002;
      display: grid;
      gap: 16px;
    }

    input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    button {
      padding: 12px;
      border: 0;
      border-radius: 6px;
      background: #3498db;
      color: white;
      cursor: pointer;
    }

    .error {
      color: #c0392b;
    }
  `],
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = '';

  submit() {
    this.error = '';

    this.auth
      .signup({
        name: this.name,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: () => (this.error = 'Unable to create account'),
      });
  }
}