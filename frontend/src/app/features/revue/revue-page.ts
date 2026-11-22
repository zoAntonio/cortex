import { Component, signal } from '@angular/core';
import { UI } from '../../shared/ui';
import { OngletOption } from '../../shared/ui/onglets';
import { Inventaire, Section } from './inventaire';
import { Nettoyage } from './nettoyage';
import { ChecklistRevue, Destination } from './checklist-revue';

type Onglet = 'revue' | 'inventaire' | 'nettoyage';

@Component({
  selector: 'app-revue-page',
  imports: [...UI, Inventaire, Nettoyage, ChecklistRevue],
  template: `
    <app-page-header titre="Revue" sous="Méthode PARA" />

    <app-onglets class="mb-4" [options]="onglets" [valeur]="onglet()" (valeurChange)="onglet.set($any($event))" />

    @switch (onglet()) {
      @case ('revue') { <app-checklist-revue (ouvrir)="ouvrir($event)" /> }
      @case ('inventaire') { <app-inventaire [(section)]="section" [(filtre)]="filtre" /> }
      @case ('nettoyage') { <app-nettoyage /> }
    }
  `,
})
export class RevuePage {
  onglets: OngletOption[] = [
    { cle: 'revue', libelle: 'Revue', icone: 'revue' },
    { cle: 'inventaire', libelle: 'Inventaire', icone: 'liste' },
    { cle: 'nettoyage', libelle: 'Nettoyage', icone: 'horloge' },
  ];

  onglet = signal<Onglet>('revue');
  section = signal<Section>('inbox');
  filtre = signal('');

  // Un clic sur « Ouvrir » dans la revue mène directement à la bonne liste, déjà filtrée
  ouvrir(d: Destination) {
    if (d.section) this.section.set(d.section);
    this.filtre.set(d.filtre ?? '');
    this.onglet.set(d.onglet);
  }
}
