import { Component, input, output } from '@angular/core';
import { Icone, NomIcone } from './icone';

export interface OngletOption {
  cle: string;
  libelle: string;
  icone?: NomIcone;
}

@Component({
  selector: 'app-onglets',
  imports: [Icone],
  host: {
    class: 'flex gap-1 overflow-x-auto rounded-2xl border border-[var(--bordure)] bg-[var(--carte)] p-1',
  },
  template: `
    @for (o of options(); track o.cle) {
      <button
        type="button"
        (click)="valeurChange.emit(o.cle)"
        class="flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
        [class]="valeur() === o.cle ? 'bg-[var(--accent)] text-[var(--sur-accent)] shadow-[0_0_16px_-4px_var(--accent)]' : 'text-[var(--texte-doux)]'"
      >
        @if (o.icone) { <app-icone [nom]="o.icone" [taille]="15" /> }
        {{ o.libelle }}
      </button>
    }
  `,
})
export class Onglets {
  options = input.required<OngletOption[]>();
  valeur = input.required<string>();
  valeurChange = output<string>();
}
