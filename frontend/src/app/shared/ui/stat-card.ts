import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  host: {
    class: 'block rounded-2xl border border-[var(--bordure)] bg-[var(--carte)] p-3',
  },
  template: `
    <p class="text-xs text-[var(--texte-doux)]">{{ libelle() }}</p>
    <p class="text-xl font-bold" [class]="couleur()">{{ valeur() }}</p>
    @if (sous()) {
      <p class="text-xs text-[var(--texte-doux)]">{{ sous() }}</p>
    }
  `,
})
export class StatCard {
  libelle = input.required<string>();
  valeur = input.required<string | number>();
  sous = input<string | null>(null);
  ton = input<'normal' | 'bon' | 'mauvais'>('normal');

  couleur = computed(() =>
    this.ton() === 'bon' ? 'text-emerald-500' : this.ton() === 'mauvais' ? 'text-red-500' : '',
  );
}