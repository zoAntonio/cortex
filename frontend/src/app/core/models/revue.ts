export type TypeElement = 'tache' | 'projet' | 'ressource' | 'area';

// Forme commune à tous les éléments PARA (les champs propres à un type sont optionnels)
export interface Element {
  id: string;
  type: TypeElement;
  nom: string;
  statut: string | null;
  categorie: string;
  priorite?: string | null;
  echeance?: string | null;
  // tâche
  termine?: boolean;
  aRevoir?: boolean;
  enRetard?: boolean;
  // projet
  total?: number;
  terminees?: number;
  ouvertes?: number;
  sansArea?: boolean;
  candidatTache?: boolean;
  convertible?: boolean;
  inactif?: boolean;
  // ressource
  pause?: boolean;
  // area
  sansProjetActif?: boolean;
}

export interface ElementsResponse {
  archive: boolean;
  compteurs: { taches: number; projets: number; ressources: number; areas: number };
  taches: Element[];
  projets: Element[];
  ressources: Element[];
  areas: Element[];
}

export interface EtatRevue {
  aujourdhui: string;
  semaine: string;
  mois: string;
  compteurs: {
    inboxProjets: number;
    inboxRessources: number;
    tachesEnRetard: number;
    tachesARevoir: number;
    ressourcesARevoir: number;
    projetsSansArea: number;
    projetsInactifs: number;
    projetsCandidatsTaches: number;
    projetsPlanifies: number;
    areasSansProjetActif: number;
  };
}

export const STATUTS: Partial<Record<TypeElement, string[]>> = {
  projet: ['Inbox', 'Planned', 'In progress', 'En pause', 'Done'],
  ressource: ['Inbox', 'To Review', 'Done'],
  area: ['Pas commencé', 'En cours', 'Terminé'],
};
