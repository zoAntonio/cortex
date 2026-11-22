import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { RevueService } from './revue.service';
import { Element } from '../../core/models/revue';
import { UI } from '../../shared/ui';

const iso = (d: Date) => d.toLocaleDateString('en-CA');
const plusJours = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const lundiProchain = () => plusJours(((8 - new Date().getDay()) % 7) || 7);

@Component({
  selector: 'app-nettoyage',
  imports: [...UI],
  template: `
    <p class="mb-4 text-sm text-[var(--texte-doux)]">
      Tâches non terminées dont l’échéance est dépassée : reporte-les, termine-les ou archive-les.
    </p>

    <app-etat [chargement]="chargement()" [erreur]="erreur()" />

    @if (message()) {
      <p class="badge badge-ok mb-3 !rounded-2xl !px-3 !py-2 !text-sm"><app-icone nom="cocheCercle" [taille]="16" />{{ message() }}</p>
    }

    @if (taches().length) {
      <app-carte class="sticky top-3 z-10 mb-3 !bg-[var(--carte)]/95 backdrop-blur">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <label class="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" class="accent-[var(--accent)]" [checked]="toutCoche()" (change)="toutBasculer()" />
            {{ selection().size }} / {{ taches().length }}
          </label>
          <span class="ml-auto flex flex-wrap items-center gap-1.5">
            <button type="button" class="chip" [class.chip-on]="date() === demain" (click)="date.set(demain)">Demain</button>
            <button type="button" class="chip" [class.chip-on]="date() === lundi" (click)="date.set(lundi)">Lundi</button>
            <button type="button" class="chip" [class.chip-on]="date() === semaine" (click)="date.set(semaine)">+7 j</button>
            <input type="date" class="champ" [value]="date()" (change)="date.set(val($event))" />
          </span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary" [disabled]="!pret()" (click)="reporter()"><app-icone nom="calendrier" [taille]="14" />Reporter</button>
          <button type="button" class="btn" [disabled]="!pret()" (click)="terminer()"><app-icone nom="coche" [taille]="14" />Terminer</button>
          <button type="button" class="btn" [disabled]="!pret()" (click)="archiver()"><app-icone nom="archive" [taille]="14" />Archiver</button>
        </div>
      </app-carte>

      <div class="flex flex-col gap-2.5">
        @for (t of taches(); track t.id) {
          <label class="flex cursor-pointer items-start gap-3 rounded-3xl border bg-[var(--carte)] p-3.5 transition-colors"
                 [class]="selection().has(t.id) ? 'border-[var(--accent)]' : 'border-[var(--bordure)]'">
            <input type="checkbox" class="mt-1 accent-[var(--accent)]" [checked]="selection().has(t.id)" (change)="basculer(t.id)" />
            <span class="min-w-0">
              <span class="block font-semibold leading-snug">{{ t.nom }}</span>
              <span class="mt-1.5 flex flex-wrap gap-1.5">
                <span class="badge badge-danger"><app-icone nom="alerte" [taille]="12" />{{ retard(t) }} j de retard</span>
                <span class="badge">{{ t.categorie }}</span>
              </span>
            </span>
          </label>
        }
      </div>
    } @else if (!chargement() && !erreur()) {
      <div class="flex flex-col items-center gap-2 py-12 text-[var(--texte-doux)]">
        <app-icone nom="cocheCercle" [taille]="36" class="text-[var(--accent)]" />
        <p class="text-sm">Aucune tâche en retard.</p>
      </div>
    }
  `,
})
export class Nettoyage {
  private service = inject(RevueService);

  demain = plusJours(1);
  lundi = lundiProchain();
  semaine = plusJours(7);

  toutes = signal<Element[]>([]);
  selection = signal<Set<string>>(new Set());
  date = signal(this.demain);
  chargement = signal(false);
  enCours = signal(false); // écriture en cours : bloque les boutons sans masquer la liste
  erreur = signal<string | null>(null);
  message = signal<string | null>(null);

  // Les plus anciennes d'abord
  taches = computed(() =>
    this.toutes().filter((t) => t.enRetard).sort((a, b) => (a.echeance ?? '').localeCompare(b.echeance ?? '')),
  );
  toutCoche = computed(() => this.taches().length > 0 && this.selection().size === this.taches().length);
  pret = computed(() => this.selection().size > 0 && !this.enCours());

  constructor() {
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.service.elements(false).subscribe({
      next: (r) => {
        this.toutes.set(r.taches);
        this.selection.set(new Set());
        this.chargement.set(false);
      },
      error: (e) => this.echec(e),
    });
  }

  basculer(id: string) {
    this.selection.update((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  toutBasculer() {
    this.selection.set(this.toutCoche() ? new Set() : new Set(this.taches().map((t) => t.id)));
  }

  reporter() {
    const ids = [...this.selection()];
    const date = this.date();
    this.lancer(
      this.service.reporter(ids, date),
      `${ids.length} tâche(s) reportée(s) au ${date}`,
      ids,
      // Reportée dans le futur : elle n'est plus en retard, donc elle quitte la liste
      (t) => { const e = { ...t, echeance: date }; return date < iso(new Date()) ? e : { ...e, enRetard: false }; },
    );
  }
  terminer() {
    const ids = [...this.selection()];
    // Séquentiel côté serveur pour reporter ; ici les appels partent ensemble, le SDK gère le débit
    this.lancer(forkJoin(ids.map((id) => this.service.terminerTache(id))), `${ids.length} tâche(s) terminée(s)`, ids, () => null);
  }
  archiver() {
    const ids = [...this.selection()];
    this.lancer(forkJoin(ids.map((id) => this.service.archiver('tache', id))), `${ids.length} tâche(s) archivée(s)`, ids, () => null);
  }

  // Écriture puis mise à jour locale : les tâches traitées disparaissent, rien ne se recharge
  private lancer(appel: Observable<unknown>, succes: string, ids: string[], maj: (t: Element) => Element | null) {
    this.enCours.set(true);
    this.erreur.set(null);
    this.message.set(null);
    appel.subscribe({
      next: () => {
        const cibles = new Set(ids);
        this.toutes.update((l) => l.flatMap((t) => (cibles.has(t.id) ? (maj(t) ?? []) : [t])));
        this.selection.set(new Set());
        this.message.set(succes);
        this.enCours.set(false);
      },
      error: (e) => this.echec(e),
    });
  }

  private echec(e: { error?: { erreur?: { message?: string } } }) {
    this.erreur.set(e.error?.erreur?.message ?? 'Backend injoignable');
    this.chargement.set(false);
    this.enCours.set(false);
  }

  retard(t: Element) {
    return Math.round((Date.parse(iso(new Date())) - Date.parse(t.echeance!)) / 86400000);
  }
  val(ev: Event) { return (ev.target as HTMLInputElement).value; }
}
