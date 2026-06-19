import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Product } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(filter?: any, page = 1, pageSize = 12): Observable<any> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .get<any>('http://localhost:3333/items', {
        headers: this.getHeaders(),
        params: filter?.searchTerm
          ? { search: filter.searchTerm }
          : {},
      })
      .pipe(
        map((response) => {
          this.loading.set(false);

          const items = response.data.map((item: any) => ({
            id: item._id,
            name: item.title,
            description: item.description,
            category: item.category,
            price: item.price,
            imageUrl: 'https://placehold.co/300x300?text=Catalog+Item',
            inStock: true,
            rating: 5,
            reviewCount: 0,
          }));

          return {
            items,
            total: items.length,
            page: 1,
            pageSize: items.length,
            totalPages: 1,
          };
        }),
        catchError((error) => {
          this.loading.set(false);
          this.error.set(error.message);
          console.error(error);

          return of({
            items: [],
            total: 0,
            page: 1,
            pageSize: 0,
            totalPages: 0,
          });
        })
      );
  }

  getProductById(id: string): Observable<Product | null> {
    return of(null);
  }

  getCategories(): Observable<string[]> {
    return of([]);
  }

  getPriceRange(): Observable<{ min: number; max: number }> {
    return of({ min: 0, max: 1000 });
  }
}