import { Component, computed, input } from '@angular/core';
import { Icone, NomIcone } from './icone';

@Component({
  selector: 'app-stat-card',
  imports: [Icone],
  host: {
    class:
      'block rounded-3xl border border-[var(--bordure)] bg-gradient-to-b from-[var(--carte-haute)] to-[var(--carte)] p-3.5',
  },
  template: `
    <p class="label-hud flex items-center gap-1.5">
      @if (icone(); as i) { <app-icone [nom]="i" [taille]="13" /> }
      {{ libelle() }}
    </p>
    <p class="mt-1 font-display text-2xl font-bold leading-none" [class]="couleur()">{{ valeur() }}</p>
    @if (sous()) {
      <p class="mt-1 text-xs text-[var(--texte-doux)]">{{ sous() }}</p>
    }
  `,
})
export class StatCard {
  libelle = input.required<string>();
  valeur = input.required<string | number>();
  sous = input<string | null>(null);
  icone = input<NomIcone | null>(null);
  ton = input<'normal' | 'bon' | 'mauvais'>('normal');

  couleur = computed(() =>
    this.ton() === 'bon' ? 'text-[var(--accent)]' : this.ton() === 'mauvais' ? 'text-[var(--danger)]' : '',
  );
}
