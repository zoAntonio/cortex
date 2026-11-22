import { Component, computed, inject, model, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RevueService } from './revue.service';
import { Element, ElementsResponse, STATUTS, TypeElement } from '../../core/models/revue';
import { NomIcone } from '../../shared/ui/icone';
import { OngletOption } from '../../shared/ui/onglets';
import { UI } from '../../shared/ui';

export type Section = 'inbox' | 'projets' | 'taches' | 'ressources' | 'areas' | 'archives';
type Tri = 'nom' | 'statut' | 'echeance';

const SECTIONS: OngletOption[] = [
  { cle: 'inbox', libelle: 'Inbox', icone: 'boite' },
  { cle: 'projets', libelle: 'Projets', icone: 'dossier' },
  { cle: 'taches', libelle: 'Tâches', icone: 'coche' },
  { cle: 'ressources', libelle: 'Ressources', icone: 'signet' },
  { cle: 'areas', libelle: 'Areas', icone: 'boussole' },
  { cle: 'archives', libelle: 'Archives', icone: 'archive' },
];

// Filtres rapides : un par décision de revue (les compteurs de la revue y mènent)
const PREDICATS: Record<string, (e: Element) => boolean> = {
  inactifs: (e) => !!e.inactif,
  candidats: (e) => !!e.candidatTache,
  'sans-area': (e) => !!e.sansArea,
  planifies: (e) => e.statut === 'Planned',
  'en-retard': (e) => !!e.enRetard,
  'a-revoir': (e) => !!e.aRevoir || e.statut === 'To Review',
  'sans-projet-actif': (e) => !!e.sansProjetActif,
};

const FILTRES: Partial<Record<Section, { cle: string; libelle: string }[]>> = {
  projets: [
    { cle: 'inactifs', libelle: 'Inactifs' },
    { cle: 'candidats', libelle: 'Sans tâche' },
    { cle: 'sans-area', libelle: 'Sans area' },
    { cle: 'planifies', libelle: 'Planifiés' },
  ],
  taches: [
    { cle: 'en-retard', libelle: 'En retard' },
    { cle: 'a-revoir', libelle: 'À revoir' },
  ],
  ressources: [{ cle: 'a-revoir', libelle: 'À revoir' }],
  areas: [{ cle: 'sans-projet-actif', libelle: 'Sans projet actif' }],
};

const ICONES: Record<TypeElement, NomIcone> = { tache: 'coche', projet: 'dossier', ressource: 'signet', area: 'boussole' };

@Component({
  selector: 'app-inventaire',
  imports: [...UI],
  template: `
    <app-onglets class="mb-3" [options]="sections" [valeur]="section()" (valeurChange)="allerSection($event)" />

    <div class="mb-4 flex flex-wrap items-center gap-2">
      @for (f of filtresDispo(); track f.cle) {
        <button type="button" [class]="chip(filtre() === f.cle)" (click)="filtre.set(filtre() === f.cle ? '' : f.cle)">
          {{ f.libelle }}
        </button>
      }
      <span class="ml-auto flex items-center gap-2 text-xs text-[var(--texte-doux)]">
        <select class="champ" aria-label="Trier" (change)="tri.set($any(val($event)))">
          <option value="nom">Tri : nom</option>
          <option value="statut">Tri : statut</option>
          <option value="echeance">Tri : échéance</option>
        </select>
        <label class="flex items-center gap-1.5 font-medium">
          <input type="checkbox" class="accent-[var(--accent)]" [checked]="grouper()" (change)="grouper.set(!grouper())" /> Grouper
        </label>
      </span>
    </div>

    <app-etat [chargement]="chargement()" [erreur]="erreur()" />

    @for (g of groupes(); track g.titre) {
      @if (g.titre) {
        <h3 class="label-hud mb-2 mt-5 flex items-center gap-2">
          {{ g.titre }} <span class="badge">{{ g.items.length }}</span>
        </h3>
      }
      <div class="flex flex-col gap-2.5">
        @for (e of g.items; track e.id) {
          <app-carte [class]="occupe().has(e.id) ? 'opacity-50' : ''">
            <div class="flex items-start gap-3">
              <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/12 text-[var(--accent)]">
                <app-icone [nom]="icone(e)" [taille]="20" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="font-semibold leading-snug" [class.line-through]="e.termine" [class.opacity-60]="e.termine">{{ e.nom || '(sans titre)' }}</p>
                <p class="mt-1.5 flex flex-wrap items-center gap-1.5">
                  @if (section() === 'archives' || section() === 'inbox') { <span class="badge capitalize">{{ e.type }}</span> }
                  @if (e.statut) { <span class="badge">{{ e.statut }}</span> }
                  @if (e.type === 'projet') { <span class="badge">{{ e.terminees }}/{{ e.total }} tâches</span> }
                  @if (e.echeance) {
                    <span class="badge" [class.badge-danger]="e.enRetard"><app-icone nom="calendrier" [taille]="12" />{{ date(e.echeance) }}</span>
                  }
                  @if (e.aRevoir) { <span class="badge badge-warn"><app-icone nom="oeil" [taille]="12" />À revoir</span> }
                  @if (e.sansArea) { <span class="badge badge-warn">Sans area</span> }
                  @if (e.inactif) { <span class="badge badge-warn">Inactif</span> }
                </p>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              @if (section() === 'archives') {
                <button type="button" class="btn" [disabled]="occupe().has(e.id)" (click)="restaurer(e)"><app-icone nom="annuler" [taille]="14" />Restaurer</button>
              } @else {
                @if (statutsDe(e); as liste) {
                  <select class="champ" [disabled]="occupe().has(e.id)" (change)="changerStatut(e, val($event))">
                    @for (s of liste; track s) { <option [value]="s" [selected]="s === e.statut">{{ s }}</option> }
                  </select>
                }
                @if (e.type === 'tache' && !e.termine) {
                  <button type="button" class="btn btn-primary" [disabled]="occupe().has(e.id)" (click)="terminer(e)"><app-icone nom="coche" [taille]="14" />Terminer</button>
                }
                @if (e.type === 'projet' && e.convertible) {
                  <button type="button" class="btn" [disabled]="occupe().has(e.id)" (click)="convertir(e)"><app-icone nom="fleche" [taille]="14" />En tâche</button>
                }
                <button type="button" class="btn" [disabled]="occupe().has(e.id)" (click)="archiver(e)"><app-icone nom="archive" [taille]="14" />Archiver</button>
              }
            </div>
          </app-carte>
        }
      </div>
    } @empty {
      @if (!chargement()) {
        <div class="flex flex-col items-center gap-2 py-12 text-[var(--texte-doux)]">
          <app-icone nom="cocheCercle" [taille]="36" class="text-[var(--accent)]" />
          <p class="text-sm">Rien ici, tout est à jour.</p>
        </div>
      }
    }
  `,
})
export class Inventaire {
  private service = inject(RevueService);

  sections = SECTIONS;

  section = model<Section>('inbox');
  filtre = model<string>('');
  tri = signal<Tri>('nom');
  grouper = signal(true);

  data = signal<ElementsResponse | null>(null);
  archives = signal<ElementsResponse | null>(null);
  chargement = signal(false);
  erreur = signal<string | null>(null);
  occupe = signal<Set<string>>(new Set());

  filtresDispo = computed(() => FILTRES[this.section()] ?? []);

  private base = computed<Element[]>(() => {
    const s = this.section();
    if (s === 'archives') {
      const a = this.archives();
      return a ? [...a.projets, ...a.taches, ...a.ressources, ...a.areas] : [];
    }
    const d = this.data();
    if (!d) return [];
    if (s === 'inbox') return [...d.projets, ...d.ressources].filter((e) => e.statut === 'Inbox');
    return d[s];
  });

  groupes = computed(() => {
    const pred = PREDICATS[this.filtre()];
    const items = (pred ? this.base().filter(pred) : [...this.base()]).sort(this.comparateur());
    if (!this.grouper() || this.section() === 'inbox') return items.length ? [{ titre: '', items }] : [];

    const m = new Map<string, Element[]>();
    for (const e of items) m.set(e.categorie, [...(m.get(e.categorie) ?? []), e]);
    return [...m.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([titre, items]) => ({ titre, items }));
  });

  constructor() {
    this.charger();
  }

  private comparateur() {
    const tri = this.tri();
    return (a: Element, b: Element) => {
      if (tri === 'echeance') {
        // Sans échéance en dernier
        if (!a.echeance !== !b.echeance) return a.echeance ? -1 : 1;
        const c = (a.echeance ?? '').localeCompare(b.echeance ?? '');
        if (c) return c;
      }
      if (tri === 'statut') {
        const c = (a.statut ?? '').localeCompare(b.statut ?? '');
        if (c) return c;
      }
      return a.nom.localeCompare(b.nom);
    };
  }

  allerSection(s: string) {
    this.section.set(s as Section);
    this.filtre.set('');
    if (s === 'archives' && !this.archives()) this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(null);
    const archives = this.section() === 'archives';
    this.service.elements(archives).subscribe({
      next: (r) => {
        (archives ? this.archives : this.data).set(r);
        this.chargement.set(false);
        // Le mode normal sert aussi de base pour les compteurs : on le garde à jour
        if (archives && !this.data()) this.service.elements(false).subscribe((d) => this.data.set(d));
      },
      error: (e) => this.echec(e),
    });
  }

  // Écriture puis mise à jour LOCALE : seul l'élément touché change ou disparaît, rien ne se recharge.
  // maj renvoie l'élément modifié, ou null pour le retirer de la liste.
  private agir(e: Element, appel: Observable<unknown>, maj: (x: Element) => Element | null, apres?: () => void) {
    this.occupe.update((s) => new Set(s).add(e.id));
    this.erreur.set(null);
    appel.subscribe({
      next: () => {
        this.libere(e.id);
        const f = (r: ElementsResponse | null) =>
          r && {
            ...r,
            taches: this.appliquer(r.taches, e.id, maj),
            projets: this.appliquer(r.projets, e.id, maj),
            ressources: this.appliquer(r.ressources, e.id, maj),
            areas: this.appliquer(r.areas, e.id, maj),
          };
        this.data.update(f);
        this.archives.update(f);
        apres?.();
      },
      error: (err) => { this.libere(e.id); this.echec(err); },
    });
  }

  private libere(id: string) {
    this.occupe.update((s) => { const n = new Set(s); n.delete(id); return n; });
  }

  private appliquer(liste: Element[], id: string, maj: (x: Element) => Element | null) {
    return liste.flatMap((x) => (x.id === id ? (maj(x) ?? []) : [x]));
  }

  // Remet à jour en arrière-plan la liste qui n'est pas affichée (sans écran de chargement)
  private rafraichirAutre(archives: boolean) {
    this.service.elements(archives).subscribe((r) => (archives ? this.archives : this.data).set(r));
  }

  private echec(e: { error?: { erreur?: { message?: string } } }) {
    this.erreur.set(e.error?.erreur?.message ?? 'Backend injoignable');
    this.chargement.set(false);
  }

  // Archiver : l'élément quitte la liste ; l'onglet Archives se rechargera à sa prochaine ouverture
  archiver(e: Element) {
    this.agir(e, this.service.archiver(e.type, e.id, true), () => null, () => this.archives.set(null));
  }
  // Restaurer : il quitte les archives ; les listes normales sont rafraîchies discrètement
  restaurer(e: Element) {
    this.agir(e, this.service.archiver(e.type, e.id, false), () => null, () => this.rafraichirAutre(false));
  }
  terminer(e: Element) {
    this.agir(e, this.service.terminerTache(e.id), (x) => ({ ...x, termine: true, enRetard: false, statut: 'Terminée' }));
  }
  changerStatut(e: Element, statut: string) {
    this.agir(e, this.service.statut(e.type, e.id, statut), (x) => ({ ...x, statut }));
  }
  convertir(e: Element) {
    if (!confirm(`Convertir « ${e.nom} » en tâche ? Le projet sera archivé.`)) return;
    // La nouvelle tâche apparaît via un rafraîchissement discret
    this.agir(e, this.service.convertir(e.id), () => null, () => { this.archives.set(null); this.rafraichirAutre(false); });
  }

  statutsDe(e: Element) {
    return STATUTS[e.type] ?? null;
  }
  icone(e: Element): NomIcone { return ICONES[e.type]; }
  val(ev: Event) { return (ev.target as HTMLSelectElement).value; }

  chip(actif: boolean) {
    return actif ? 'chip chip-on' : 'chip';
  }

  date(d: string) {
    return new Date(d + 'T00:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  }
}
