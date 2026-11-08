import { Component, input } from '@angular/core';

@Component({
  selector: 'app-barre-progression',
  host: { class: 'block h-2 overflow-hidden rounded-full bg-[var(--cellule-off)]' },
  template: `<div class="h-full rounded-full" [style.width.%]="pct()" [style.background]="couleur()"></div>`,
})
export class BarreProgression {
  pct = input.required<number>();
  couleur = input('var(--accent)');
}