import { Component, input } from '@angular/core';

@Component({
  selector: 'app-etat',
  template: `
    @if (chargement()) {
      <div class="flex items-center justify-center gap-3 py-10 text-sm text-[var(--texte-doux)]">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bordure)] border-t-[var(--accent)]"></span>
        Chargement
      </div>
    }
    @if (erreur()) {
      <p class="my-4 rounded-2xl border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">{{ erreur() }}</p>
    }
  `,
})
export class Etat {
  chargement = input(false);
  erreur = input<string | null>(null);
}
