import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icone, NomIcone } from './ui/icone';

interface Entree {
  chemin: string;
  libelle: string;
  icone: NomIcone;
}

const MENU: Entree[] = [
  { chemin: '/habitudes', libelle: 'Habitudes', icone: 'flamme' },
  { chemin: '/evolution', libelle: 'Évolution', icone: 'courbe' },
  { chemin: '/objectifs', libelle: 'Objectifs', icone: 'cible' },
  { chemin: '/projets', libelle: 'Projets', icone: 'dossier' },
  { chemin: '/revue', libelle: 'Revue', icone: 'revue' },
];

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icone],
  template: `
    <main class="mx-auto max-w-3xl px-4 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <router-outlet />
    </main>

    <!-- Barre d'onglets du bas, comme une application mobile -->
    <nav
      class="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md justify-around rounded-3xl border border-[var(--bordure)] bg-[var(--carte)]/90 p-1.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      @for (m of menu; track m.chemin) {
        <a
          [routerLink]="m.chemin"
          routerLinkActive="!text-[var(--accent)] bg-[var(--accent)]/12 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
          class="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[var(--texte-doux)] transition-colors"
        >
          <app-icone [nom]="m.icone" [taille]="22" />
          <span class="text-[10px] font-semibold leading-none">{{ m.libelle }}</span>
        </a>
      }
    </nav>
  `,
})
export class Layout {
  menu = MENU;
}
