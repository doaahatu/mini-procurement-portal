import { Route } from '@angular/router';
import { authGuard } from '@org/shop/data';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('@org/shop/feature-auth').then(m => m.SigninComponent),
  },
  {
     path: 'signup',
     loadComponent: () =>
       import('@org/shop/feature-auth').then(m => m.SignupComponent),
  },

  {
    path: 'create-item',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@org/shop/feature-auth').then(m => m.CreateItemComponent),
  },

  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@org/shop/feature-products').then(m => m.featureProductsRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@org/shop/feature-product-detail').then(
        m => m.featureProductDetailRoutes
      ),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];