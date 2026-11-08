import { Component, computed, inject, signal } from '@angular/core';
import { ProjetsService } from './projets.service';
import { ProjetsResponse } from '../../core/models/projets';

type Filtre = 'tous' | 'actifs' | 'pause' | 'termines';

const COULEURS_PRIORITE: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#6b7280',
};

@Component({
  selector: 'app-projets-page',
  templateUrl: './projets-page.html',
})
export class ProjetsPage {
  private service = inject(ProjetsService);

  filtres: { cle: Filtre; libelle: string }[] = [
    { cle: 'tous', libelle: 'Tous' },
    { cle: 'actifs', libelle: 'En cours' },
    { cle: 'pause', libelle: 'En pause' },
    { cle: 'termines', libelle: 'Terminés' },
  ];

  filtre = signal<Filtre>('actifs');
  data = signal<ProjetsResponse | null>(null);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  visibles = computed(() => {
    const d = this.data();
    if (!d) return [];
    switch (this.filtre()) {
      case 'actifs':
        return d.projets.filter((p) => p.statut === 'In progress' || p.statut === 'Planned');
      case 'pause':
        return d.projets.filter((p) => p.statut === 'En pause');
      case 'termines':
        return d.projets.filter((p) => p.statut === 'Done');
      default:
        return d.projets;
    }
  });

  constructor() {
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(null);
    this.service.get().subscribe({
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

  couleurPriorite(p: string | null) {
    return (p && COULEURS_PRIORITE[p]) || '#6b7280';
  }

  date(d: string) {
    return new Date(d + 'T00:00:00Z').toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', timeZone: 'UTC',
    });
  }
}