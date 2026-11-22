import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../core/config';
import { ApiOk } from '../../core/models/api';
import { ElementsResponse, EtatRevue, TypeElement } from '../../core/models/revue';

@Injectable({ providedIn: 'root' })
export class RevueService {
  private http = inject(HttpClient);
  private base = `${API_URL}/revue`;

  // ?refresh=1 : après une écriture, on ne veut pas lire le cache serveur
  elements(archive = false) {
    return this.http
      .get<ApiOk<ElementsResponse>>(`${this.base}/elements`, {
        params: { archive: archive ? '1' : '0', refresh: '1' },
      })
      .pipe(map((r) => r.data));
  }

  etat() {
    return this.http
      .get<ApiOk<EtatRevue>>(`${this.base}/etat`, { params: { refresh: '1' } })
      .pipe(map((r) => r.data));
  }

  archiver(type: TypeElement, id: string, archive = true) {
    return this.http.post(`${this.base}/archiver`, { type, id, archive });
  }

  statut(type: TypeElement, id: string, statut: string) {
    return this.http.post(`${this.base}/statut`, { type, id, statut });
  }

  terminerTache(id: string) {
    return this.http.post(`${this.base}/taches/${id}/terminer`, {});
  }

  reporter(ids: string[], date: string) {
    return this.http.post(`${this.base}/taches/reporter`, { ids, date });
  }

  convertir(projetId: string) {
    return this.http.post(`${this.base}/projets/${projetId}/convertir`, {});
  }
}
