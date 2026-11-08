import { Routes } from '@angular/router';
import { Layout } from './shared/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'habitudes', pathMatch: 'full' },
      {
        path: 'habitudes',
        loadComponent: () =>
          import('./features/habitudes/habitudes-page').then((m) => m.HabitudesPage),
      },
      {
        path: 'evolution',
        loadComponent: () =>
          import('./features/evolution/evolution-page').then((m) => m.EvolutionPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];