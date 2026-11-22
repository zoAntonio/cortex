import { Component, computed, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevueService } from './revue.service';
import { EtatRevue } from '../../core/models/revue';
import { UI } from '../../shared/ui';
import { Section } from './inventaire';

type Rythme = 'hebdo' | 'mensuel';

export interface Destination {
  onglet: 'inventaire' | 'nettoyage';
  section?: Section;
  filtre?: string;
}

interface Etape {
  cle: string;
  libelle: string;
  detail?: string;
  // Nombre d'éléments qui demandent une décision (étape automatisable)
  compte?: (c: EtatRevue['compteurs']) => number;
  vers?: Destination | { route: string };
}

const HEBDO: Etape[] = [
  { cle: 'emails', libelle: 'Vider mes e-mails importants' },
  { cle: 'agenda', libelle: 'Vérifier mon agenda (passé et futur)' },
  { cle: 'bureau', libelle: 'Nettoyer le bureau de mon ordinateur' },
  {
    cle: 'inbox', libelle: 'Vider mon Inbox',
    detail: 'Classer chaque nouvelle idée (Projet, Area, Ressource) sans la distiller.',
    compte: (c) => c.inboxProjets + c.inboxRessources,
    vers: { onglet: 'inventaire', section: 'inbox' },
  },
  {
    cle: 'retard', libelle: 'Nettoyer les tâches non accomplies',
    detail: 'Reporter, terminer ou archiver.',
    compte: (c) => c.tachesEnRetard,
    vers: { onglet: 'nettoyage' },
  },
  {
    cle: 'revoir', libelle: 'Relire les tâches marquées « à revoir »',
    compte: (c) => c.tachesARevoir,
    vers: { onglet: 'inventaire', section: 'taches', filtre: 'a-revoir' },
  },
  { cle: 'priorites', libelle: 'Planifier mes priorités de la semaine suivante' },
];

const MENSUEL: Etape[] = [
  { cle: 'objectifs', libelle: 'Mettre à jour mes objectifs trimestriels / annuels', vers: { route: '/objectifs' } },
  {
    cle: 'inactifs', libelle: 'Archiver les projets devenus inactifs',
    detail: 'Statut Done, ou toutes les tâches terminées.',
    compte: (c) => c.projetsInactifs,
    vers: { onglet: 'inventaire', section: 'projets', filtre: 'inactifs' },
  },
  {
    cle: 'candidats', libelle: 'Transformer en tâche les projets sans tâche',
    detail: 'Certains projets méritent juste d’être une tâche.',
    compte: (c) => c.projetsCandidatsTaches,
    vers: { onglet: 'inventaire', section: 'projets', filtre: 'candidats' },
  },
  {
    cle: 'areas', libelle: 'Passer en revue mes Areas',
    detail: 'Santé, finances… : une Area sans projet actif demande peut-être une action.',
    compte: (c) => c.areasSansProjetActif,
    vers: { onglet: 'inventaire', section: 'areas', filtre: 'sans-projet-actif' },
  },
  {
    cle: 'unjour', libelle: 'Consulter « Un jour / Peut-être »',
    detail: 'Projets planifiés : certains rêves peuvent-ils devenir actifs ?',
    compte: (c) => c.projetsPlanifies,
    vers: { onglet: 'inventaire', section: 'projets', filtre: 'planifies' },
  },
  {
    cle: 'sansarea', libelle: 'Rattacher les projets à une Area',
    compte: (c) => c.projetsSansArea,
    vers: { onglet: 'inventaire', section: 'projets', filtre: 'sans-area' },
  },
  { cle: 'reprioriser', libelle: 'Repriorisez mes tâches', vers: { onglet: 'nettoyage' } },
];

const cleStockage = (rythme: Rythme, periode: string) => `revue:${rythme}:${periode}`;

@Component({
  selector: 'app-checklist-revue',
  imports: [...UI, RouterLink],
  template: `
    <app-onglets class="mb-4" [options]="rythmes" [valeur]="rythme()" (valeurChange)="changer($event)" />

    <app-etat [chargement]="!etat() && !erreur()" [erreur]="erreur()" />

    @if (etat(); as e) {
      <app-carte class="mb-4">
        <div class="flex items-center gap-4">
          <app-anneau [pct]="pct()" [taille]="76" [trait]="8" />
          <div class="min-w-0 flex-1">
            <p class="label-hud">{{ rythme() === 'hebdo' ? 'Revue hebdomadaire' : 'Revue mensuelle' }}</p>
            <h2 class="font-display text-xl font-bold capitalize leading-tight">{{ periodeLibelle() }}</h2>
            <p class="mt-1 text-xs text-[var(--texte-doux)]">
              {{ faites() }}/{{ etapes().length }} étapes ·
              {{ rythme() === 'hebdo' ? 'tous les 3 à 7 jours' : 'une fois par mois' }}
            </p>
          </div>
        </div>
      </app-carte>

      <div class="flex flex-col gap-2.5">
        @for (s of etapes(); track s.cle) {
          <div class="flex items-center gap-3 rounded-3xl border bg-[var(--carte)] p-3.5 transition-colors"
               [class]="coche(s.cle) ? 'border-[var(--accent)]/40 opacity-70' : 'border-[var(--bordure)]'">
            <button type="button" class="shrink-0" [attr.aria-label]="'Marquer : ' + s.libelle" (click)="basculer(s.cle)">
              <app-icone [nom]="coche(s.cle) ? 'cocheCercle' : 'cercle'" [taille]="26"
                         [class]="coche(s.cle) ? 'text-[var(--accent)]' : 'text-[var(--texte-doux)]'" />
            </button>
            <div class="min-w-0 flex-1">
              <p class="font-semibold leading-snug" [class.line-through]="coche(s.cle)">{{ s.libelle }}</p>
              @if (s.detail) { <p class="mt-0.5 text-xs text-[var(--texte-doux)]">{{ s.detail }}</p> }
            </div>
            @if (s.compte) {
              <span class="badge font-display !text-sm" [class]="s.compte(e.compteurs) > 0 ? 'badge-warn' : 'badge-ok'">
                {{ s.compte(e.compteurs) }}
              </span>
            }
            @if (route(s); as r) {
              <a [routerLink]="r" class="btn shrink-0" aria-label="Ouvrir"><app-icone nom="fleche" [taille]="14" /></a>
            } @else if (dest(s); as d) {
              <button type="button" class="btn shrink-0" aria-label="Ouvrir" (click)="ouvrir.emit(d)"><app-icone nom="fleche" [taille]="14" /></button>
            }
          </div>
        }
      </div>

      <button type="button" class="mt-5 text-xs text-[var(--texte-doux)] underline" (click)="reinitialiser()">
        Réinitialiser cette revue
      </button>
    }
  `,
})
export class ChecklistRevue {
  private service = inject(RevueService);

  ouvrir = output<Destination>();

  rythmes = [
    { cle: 'hebdo', libelle: 'Hebdomadaire' },
    { cle: 'mensuel', libelle: 'Mensuelle' },
  ];

  rythme = signal<Rythme>('hebdo');
  etat = signal<EtatRevue | null>(null);
  erreur = signal<string | null>(null);
  cochees = signal<Set<string>>(new Set());

  etapes = computed(() => (this.rythme() === 'hebdo' ? HEBDO : MENSUEL));
  faites = computed(() => this.etapes().filter((s) => this.cochees().has(s.cle)).length);
  pct = computed(() => Math.round((this.faites() / this.etapes().length) * 100));

  // Clé de la période : semaine (lundi) ou mois, pour que la revue se remette à zéro d'elle-même
  private periode = computed(() => {
    const e = this.etat();
    return e ? (this.rythme() === 'hebdo' ? e.semaine : e.mois) : '';
  });
  periodeLibelle = computed(() => {
    const p = this.periode();
    if (!p) return '';
    return this.rythme() === 'hebdo'
      ? `semaine du ${new Date(p + 'T00:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' })}`
      : new Date(p + '-01T00:00:00Z').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  });

  constructor() {
    this.service.etat().subscribe({
      next: (e) => { this.etat.set(e); this.lire(); },
      error: (e) => this.erreur.set(e.error?.erreur?.message ?? 'Backend injoignable'),
    });
  }

  changer(r: string) {
    this.rythme.set(r as Rythme);
    this.lire();
  }

  coche(cle: string) { return this.cochees().has(cle); }

  basculer(cle: string) {
    this.cochees.update((s) => { const n = new Set(s); n.has(cle) ? n.delete(cle) : n.add(cle); return n; });
    this.ecrire();
  }

  reinitialiser() {
    this.cochees.set(new Set());
    this.ecrire();
  }

  route(s: Etape) { return s.vers && 'route' in s.vers ? s.vers.route : null; }
  dest(s: Etape) { return s.vers && 'onglet' in s.vers ? s.vers : null; }

  // localStorage peut être indisponible (navigation privée…) : la revue marche quand même
  private lire() {
    try {
      const brut = localStorage.getItem(cleStockage(this.rythme(), this.periode()));
      this.cochees.set(new Set(brut ? (JSON.parse(brut) as string[]) : []));
    } catch {
      this.cochees.set(new Set());
    }
  }
  private ecrire() {
    try {
      localStorage.setItem(cleStockage(this.rythme(), this.periode()), JSON.stringify([...this.cochees()]));
    } catch { /* ignoré */ }
  }
}
