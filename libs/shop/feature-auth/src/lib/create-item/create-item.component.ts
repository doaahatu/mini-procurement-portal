import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'shop-create-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <h1>Create Item</h1>

        <input
          name="title"
          [(ngModel)]="title"
          placeholder="Title"
          required
        />

        <input
          name="category"
          [(ngModel)]="category"
          placeholder="Category"
          required
        />

        <input
          name="price"
          [(ngModel)]="price"
          type="number"
          placeholder="Price"
          required
        />

        <textarea
          name="description"
          [(ngModel)]="description"
          placeholder="Description"
          rows="4"
        ></textarea>

        <p *ngIf="error" style="color:red">
          {{ error }}
        </p>

        <button type="submit">Create Item</button>
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
      width: 420px;
      padding: 32px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 8px 24px #0002;
      display: grid;
      gap: 16px;
    }

    input, textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    button {
      padding: 12px;
      border: none;
      border-radius: 6px;
      background: #3498db;
      color: white;
      cursor: pointer;
    }
  `]
})
export class CreateItemComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  title = '';
  description = '';
  category = '';
  price = 0;
  error = '';

  submit() {
    const token = localStorage.getItem('token');

    this.http.post(
      'http://localhost:3333/items',
      {
        title: this.title,
        description: this.description,
        category: this.category,
        price: Number(this.price),
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => this.error = 'Failed to create item',
    });
  }
}