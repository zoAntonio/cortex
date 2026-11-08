import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../core/config';
import { ApiOk } from '../../core/models/api';
import { ProjetsResponse } from '../../core/models/projets';

@Injectable({ providedIn: 'root' })
export class ProjetsService {
  private http = inject(HttpClient);

  get() {
    return this.http.get<ApiOk<ProjetsResponse>>(`${API_URL}/projets`).pipe(map((r) => r.data));
  }
}