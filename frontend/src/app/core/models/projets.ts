export interface Projet {
  id: string;
  nom: string;
  statut: string | null;
  priorite: string | null;
  debut: string | null;
  fin: string | null;
  total: number;
  terminees: number;
  progression: number;
  enRetard: number;
  prochaineEcheance: string | null;
}

export interface ResumeProjets {
  projets: number;
  tachesTotal: number;
  tachesTerminees: number;
  progression: number;
  enRetard: number;
}

export interface ProjetsResponse {
  resume: ResumeProjets;
  projets: Projet[];
}