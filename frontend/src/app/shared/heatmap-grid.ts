import { Component, computed, input } from '@angular/core';

interface Cellule {
  date: string;
  fait: boolean;
  futur: boolean;
}

@Component({
  selector: 'app-heatmap-grid',
  template: `
    <div class="defilement">
      <div class="grille">
        @for (c of cellules(); track $index) {
          <span
            class="cellule"
            [class.vide]="!c"
            [class.fait]="c?.fait"
            [class.futur]="c?.futur"
            [attr.title]="c?.date"
          ></span>
        }
      </div>
    </div>
  `,
  styles: `
    .defilement { overflow-x: auto; padding-bottom: 4px; }
    .grille {
      display: grid;
      grid-template-rows: repeat(7, 12px);
      grid-auto-flow: column;
      grid-auto-columns: 12px;
      gap: 3px;
      width: max-content;
    }
    .cellule { border-radius: 3px; background: var(--cellule-off); }
    .cellule.fait { background: var(--cellule-on); }
    .cellule.futur { opacity: 0.35; }
    .cellule.vide { background: transparent; }
  `,
})
export class HeatmapGrid {
  annee = input.required<number>();
  jours = input<string[]>([]);

  cellules = computed<(Cellule | null)[]>(() => {
    const annee = this.annee();
    const faits = new Set(this.jours());
    const aujourdhui = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Indian/Antananarivo',
    });

    const debut = Date.UTC(annee, 0, 1);
    const nbJours = (Date.UTC(annee + 1, 0, 1) - debut) / 86400000;
    const decalage = (new Date(debut).getUTCDay() + 6) % 7; // lundi = 0

    const out: (Cellule | null)[] = Array(decalage).fill(null);
    for (let i = 0; i < nbJours; i++) {
      const date = new Date(debut + i * 86400000).toISOString().slice(0, 10);
      out.push({ date, fait: faits.has(date), futur: date > aujourdhui });
    }
    return out;
  });
}