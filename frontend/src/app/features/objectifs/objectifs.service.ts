import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../core/config';
import { ApiOk } from '../../core/models/api';
import { JourResponse, MoisResponse, SemaineResponse } from '../../core/models/objectifs';

@Injectable({ providedIn: 'root' })
export class ObjectifsService {
  private http = inject(HttpClient);

  private get<T>(chemin: string, date: string) {
    return this.http
      .get<ApiOk<T>>(`${API_URL}/objectifs/${chemin}`, { params: { date } })
      .pipe(map((r) => r.data));
  }

  jour = (date: string) => this.get<JourResponse>('jour', date);
  semaine = (date: string) => this.get<SemaineResponse>('semaine', date);
  mois = (date: string) => this.get<MoisResponse>('mois', date);
}