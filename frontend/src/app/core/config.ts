// Dev (ng serve, port 4200) : l'API est sur le port 3000 du même hôte.
// Version construite : l'API est servie par le même serveur, chemin relatif.
export const API_URL =
  location.port === '4200' ? `http://${location.hostname}:3000/api` : '/api';