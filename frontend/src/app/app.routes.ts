import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'habitudes', pathMatch: 'full' },
  {
    path: 'habitudes',
    loadComponent: () =>
      import('./features/habitudes/habitudes-page').then((m) => m.HabitudesPage),
  },
];