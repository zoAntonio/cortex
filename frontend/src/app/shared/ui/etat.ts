import { Component, input } from '@angular/core';

@Component({
  selector: 'app-etat',
  template: `
    @if (chargement()) {
      <p class="py-8 text-center text-[var(--texte-doux)]">Chargement…</p>
    }
    @if (erreur()) {
      <p class="py-8 text-center text-red-500">{{ erreur() }}</p>
    }
  `,
})
export class Etat {
  chargement = input(false);
  erreur = input<string | null>(null);
}