import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface Entree {
  chemin: string;
  libelle: string;
  icone: string;
  pret: boolean;
}

const MENU: Entree[] = [
  { chemin: '/habitudes', libelle: 'Habitudes', icone: '🔥', pret: true },
  { chemin: '/evolution', libelle: 'Évolution', icone: '📈', pret: true },
  { chemin: '/objectifs', libelle: 'Objectifs', icone: '🎯', pret: false },
  { chemin: '/projets', libelle: 'Projets', icone: '📁', pret: false },
];

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav
      class="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-xl gap-1 overflow-x-auto rounded-full border border-[var(--bordure)] bg-[var(--carte)]/85 p-1 shadow-lg backdrop-blur"
    >
      @for (m of menu; track m.chemin) {
        @if (m.pret) {
          <a
            [routerLink]="m.chemin"
            routerLinkActive="bg-[var(--accent)] text-white"
            class="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium"
          >
            <span>{{ m.icone }}</span>{{ m.libelle }}
          </a>
        } @else {
          <span
            class="flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium opacity-40"
            title="Bientôt disponible"
          >
            <span>{{ m.icone }}</span>{{ m.libelle }}
          </span>
        }
      }
    </nav>

    <main class="mx-auto max-w-3xl px-4 pb-8 pt-20">
      <router-outlet />
    </main>
  `,
})
export class Layout {
  menu = MENU;
}