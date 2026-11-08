import { Component, computed, inject, signal } from '@angular/core';
import { ObjectifsService } from './objectifs.service';
import { JourResponse, MoisResponse, SemaineResponse } from '../../core/models/objectifs';

type Onglet = 'jour' | 'semaine' | 'mois';

const aujourdhui = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Indian/Antananarivo' });

const addDays = (d: string, n: number) =>
  new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);

const addMois = (d: string, n: number) =>
  new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1 + n, 1)).toISOString().slice(0, 10);

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('fr-FR', { ...opts, timeZone: 'UTC' });

@Component({
  selector: 'app-objectifs-page',
  templateUrl: './objectifs-page.html',
})
export class ObjectifsPage {
  private service = inject(ObjectifsService);

  onglets: { cle: Onglet; libelle: string }[] = [
    { cle: 'jour', libelle: 'Jour' },
    { cle: 'semaine', libelle: 'Semaine' },
    { cle: 'mois', libelle: 'Mois' },
  ];

  onglet = signal<Onglet>('jour');
  date = signal(aujourdhui());

  jour = signal<JourResponse | null>(null);
  semaine = signal<SemaineResponse | null>(null);
  mois = signal<MoisResponse | null>(null);

  chargement = signal(false);
  erreur = signal<string | null>(null);

  // Titre de la période affichée, selon l'onglet
  periode = computed(() => {
    const d = this.date();
    switch (this.onglet()) {
      case 'jour':
        return fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
      case 'semaine': {
        const s = this.semaine();
        return s
          ? `${fmt(s.debut, { day: 'numeric', month: 'short' })} – ${fmt(s.fin, { day: 'numeric', month: 'short' })}`
          : '…';
      }
      case 'mois':
        return fmt(d, { month: 'long', year: 'numeric' });
    }
  });

  constructor() {
    this.charger();
  }

  choisir(o: Onglet) {
    this.onglet.set(o);
    this.charger();
  }

  naviguer(delta: number) {
    const o = this.onglet();
    this.date.update((d) =>
      o === 'jour' ? addDays(d, delta) : o === 'semaine' ? addDays(d, delta * 7) : addMois(d, delta),
    );
    this.charger();
  }

  retourAujourdhui() {
    this.date.set(aujourdhui());
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(null);

    const fin = { error: (e: any) => {
      this.erreur.set(e.error?.erreur?.message ?? 'Backend injoignable');
      this.chargement.set(false);
    } };
    const date = this.date();

    switch (this.onglet()) {
      case 'jour':
        this.service.jour(date).subscribe({ next: (r) => { this.jour.set(r); this.chargement.set(false); }, ...fin });
        break;
      case 'semaine':
        this.service.semaine(date).subscribe({ next: (r) => { this.semaine.set(r); this.chargement.set(false); }, ...fin });
        break;
      case 'mois':
        this.service.mois(date).subscribe({ next: (r) => { this.mois.set(r); this.chargement.set(false); }, ...fin });
        break;
    }
  }

  court(d: string | null) {
    return d ? fmt(d, { weekday: 'short', day: 'numeric' }) : '';
  }

  couleurNiveau(n: string) {
    return n === 'excellent' ? '#22a06b' : n === 'valide' ? '#f59e0b' : '#ef4444';
  }
}