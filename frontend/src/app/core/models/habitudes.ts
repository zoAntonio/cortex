export interface HabitudeStats {
  total: number;
  serieEnCours: number;
  meilleureSerie: number;
  tauxReussite: number;
}

export interface Habitude {
  cle: string;
  nom: string;
  jours: string[]; // dates "YYYY-MM-DD" où l'habitude est cochée
  stats: HabitudeStats;
}

export interface HeatmapResponse {
  annee: number;
  habitudes: Habitude[];
}