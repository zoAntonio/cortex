export interface JourEvolution {
  date: string;
  jour: string; // lun, mar...
  note: number | null;
  noteTaches: number | null;
  nbHabitudes: number | null;
  tachesFaites: number | null;
}

export interface StatsSemaine {
  moyenne: number | null;
  total: number;
  joursSuivis: number;
  meilleurJour: { date: string; note: number } | null;
}

export interface Semaine {
  debut: string;
  fin: string;
  jours: JourEvolution[];
  stats: StatsSemaine;
}

export interface Comparaison {
  ecartMoyenne: number | null;
  ecartPourcent: number | null;
  tendance: 'hausse' | 'baisse' | 'stable';
}

export interface EvolutionResponse {
  semaineActuelle: Semaine;
  semainePrecedente: Semaine;
  comparaison: Comparaison;
}