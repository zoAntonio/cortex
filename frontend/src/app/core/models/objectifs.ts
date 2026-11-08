export interface ObjectifJour {
  id: string;
  nom: string;
  accompli: boolean;
}
export interface JourResponse {
  date: string;
  total: number;
  accomplis: number;
  progression: number;
  objectifs: ObjectifJour[];
}

export interface JourDeSemaine {
  date: string | null;
  nom: string;
  accompli: boolean;
}
export interface ObjectifSemaine {
  id: string;
  nom: string;
  reussis: number | null;
  seuilValide: number | null;
  seuilExcellent: number | null;
  resultat: string | null;
  niveau: 'excellent' | 'valide' | 'insuffisant';
  progression: number | null;
  jours: JourDeSemaine[];
}
export interface SemaineResponse {
  debut: string;
  fin: string;
  objectifs: ObjectifSemaine[];
}

export interface ObjectifMois {
  id: string;
  nom: string;
  debut: string;
  fin: string;
}
export interface MoisResponse {
  mois: string;
  debut: string;
  fin: string;
  objectifs: ObjectifMois[];
}