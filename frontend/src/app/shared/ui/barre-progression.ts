import { Component, input } from '@angular/core';

@Component({
  selector: 'app-barre-progression',
  host: { class: 'block h-2.5 overflow-hidden rounded-full bg-[var(--cellule-off)]' },
  template: `<div
    class="h-full rounded-full transition-[width] duration-500"
    [style.width.%]="pct()"
    [style.background]="couleur()"
    style="box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 45%, transparent)"
  ></div>`,
})
export class BarreProgression {
  pct = input.required<number>();
  couleur = input('linear-gradient(90deg, var(--accent), var(--accent-2))');
}
