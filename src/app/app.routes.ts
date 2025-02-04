import {Routes} from '@angular/router'
import {authenticatedGuard} from './infra/authenticated.guard'

export const routes: Routes = [
  {
    canActivate: [authenticatedGuard],
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    canActivate: [authenticatedGuard],
    path: 'ingredients',
    loadComponent: () => import('./features/ingredients/ingredients.component').then(m => m.IngredientsComponent),
  },
  {
    canActivate: [authenticatedGuard],
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipes.component').then(m => m.RecipesComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/authentication/authentication.component').then(m => m.AuthenticationComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/authentication/components/login-form/login-form.component').then(m => m.LoginFormComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/authentication/components/registration-form/registration-form.component').then(m => m.RegistrationFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
]
