import { Component, computed, input } from '@angular/core';

// Jauge circulaire (style tableau de bord de jeu)
@Component({
  selector: 'app-anneau',
  host: { class: 'relative inline-flex items-center justify-center' },
  template: `
    <svg [attr.width]="taille()" [attr.height]="taille()" [attr.viewBox]="'0 0 ' + taille() + ' ' + taille()" class="-rotate-90">
      <circle [attr.cx]="c()" [attr.cy]="c()" [attr.r]="r()" fill="none" stroke="var(--cellule-off)" [attr.stroke-width]="trait()" />
      <circle
        [attr.cx]="c()" [attr.cy]="c()" [attr.r]="r()" fill="none" [attr.stroke]="couleur()"
        [attr.stroke-width]="trait()" stroke-linecap="round"
        [attr.stroke-dasharray]="circ()" [attr.stroke-dashoffset]="decalage()"
        style="transition: stroke-dashoffset .6s ease; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 55%, transparent))"
      />
    </svg>
    <span class="absolute font-display font-bold" [style.font-size.px]="taille() * 0.26">{{ pct() }}%</span>
  `,
})
export class Anneau {
  pct = input.required<number>();
  taille = input(72);
  trait = input(7);
  couleur = input('var(--accent)');

  c = computed(() => this.taille() / 2);
  r = computed(() => (this.taille() - this.trait()) / 2);
  circ = computed(() => 2 * Math.PI * this.r());
  decalage = computed(() => this.circ() * (1 - Math.min(100, Math.max(0, this.pct())) / 100));
}
