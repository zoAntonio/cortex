import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../core/config';
import { ApiOk } from '../../core/models/api';
import { EvolutionResponse } from '../../core/models/evolution';

@Injectable({ providedIn: 'root' })
export class EvolutionService {
  private http = inject(HttpClient);

  get(date: string) {
    return this.http
      .get<ApiOk<EvolutionResponse>>(`${API_URL}/evolution`, { params: { date } })
      .pipe(map((r) => r.data));
  }
}