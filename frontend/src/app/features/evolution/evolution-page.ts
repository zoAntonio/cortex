import { Component, computed, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { EvolutionService } from './evolution.service';
import { EvolutionResponse } from '../../core/models/evolution';

const addDays = (d: string, n: number) =>
  new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);

const aujourdhui = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Indian/Antananarivo' });

const GRIS = 'rgba(128,128,128,0.35)';
const TEXTE = 'rgba(128,128,128,0.95)';

@Component({
  selector: 'app-evolution-page',
  imports: [BaseChartDirective],
  templateUrl: './evolution-page.html',
})
export class EvolutionPage {
  private service = inject(EvolutionService);

  date = signal(aujourdhui());
  data = signal<EvolutionResponse | null>(null);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  // On ne peut pas aller au-delà de la semaine en cours
  peutAvancer = computed(() => {
    const d = this.data();
    return !!d && d.semaineActuelle.fin < aujourdhui();
  });

  chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const d = this.data();
    if (!d) return { labels: [], datasets: [] };
    return {
      labels: d.semaineActuelle.jours.map((j) => j.jour),
      datasets: [
        {
          label: 'Cette semaine',
          data: d.semaineActuelle.jours.map((j) => j.note),
          borderColor: '#22a06b',
          backgroundColor: '#22a06b',
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Semaine précédente',
          data: d.semainePrecedente.jours.map((j) => j.note),
          borderColor: GRIS,
          backgroundColor: GRIS,
          borderDash: [6, 4],
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };
  });

  options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 20, grid: { color: GRIS }, ticks: { color: TEXTE } },
      x: { grid: { display: false }, ticks: { color: TEXTE } },
    },
    plugins: { legend: { labels: { color: TEXTE, boxWidth: 12 } } },
  };

  constructor() {
    this.charger();
  }

  semaine(delta: number) {
    this.date.update((d) => addDays(d, delta * 7));
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(null);
    this.service.get(this.date()).subscribe({
      next: (r) => {
        this.data.set(r);
        this.chargement.set(false);
      },
      error: (e) => {
        this.erreur.set(e.error?.erreur?.message ?? 'Backend injoignable');
        this.chargement.set(false);
      },
    });
  }

  // Helpers d'affichage
  jourCourt(d: string) {
    return new Date(d + 'T00:00:00Z').toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', timeZone: 'UTC',
    });
  }

  nombre(n: number | null, suffixe = '') {
    return n === null ? '–' : `${n}${suffixe}`;
  }

  ecart(n: number | null, suffixe = '') {
    if (n === null) return '–';
    return `${n > 0 ? '+' : ''}${n}${suffixe}`;
  }
}