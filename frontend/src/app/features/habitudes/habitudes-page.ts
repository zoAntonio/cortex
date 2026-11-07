import { Component, inject, signal } from '@angular/core';
import { HabitudesService } from './habitudes.service';
import { HeatmapResponse } from '../../core/models/habitudes';
import { HeatmapGrid } from '../../shared/heatmap-grid';

@Component({
  selector: 'app-habitudes-page',
  imports: [HeatmapGrid],
  templateUrl: './habitudes-page.html',
  styleUrl: './habitudes-page.scss',
})
export class HabitudesPage {
  private service = inject(HabitudesService);

  annee = signal(new Date().getFullYear());
  data = signal<HeatmapResponse | null>(null);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  constructor() {
    this.charger();
  }

  changerAnnee(delta: number) {
    this.annee.update((a) => a + delta);
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(null);
    this.service.heatmap(this.annee()).subscribe({
      next: (r) => {
        this.data.set(r);
        this.chargement.set(false);
      },
      error: (e) => {
        this.erreur.set(e.error?.erreur ?? 'Backend injoignable');
        this.chargement.set(false);
      },
    });
  }
}