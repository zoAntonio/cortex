import { Component, input, output } from '@angular/core';

export interface OngletOption {
  cle: string;
  libelle: string;
}

@Component({
  selector: 'app-onglets',
  host: {
    class: 'flex gap-1 overflow-x-auto rounded-full border border-[var(--bordure)] bg-[var(--carte)] p-1',
  },
  template: `
    @for (o of options(); track o.cle) {
      <button
        type="button"
        (click)="valeurChange.emit(o.cle)"
        class="flex-1 shrink-0 rounded-full px-3 py-2 text-sm font-medium"
        [class]="valeur() === o.cle ? 'bg-[var(--accent)] text-white' : ''"
      >{{ o.libelle }}</button>
    }
  `,
})
export class Onglets {
  options = input.required<OngletOption[]>();
  valeur = input.required<string>();
  valeurChange = output<string>();
}