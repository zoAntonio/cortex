import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../core/config';
import { ApiOk } from '../../core/models/api';
import { HeatmapResponse } from '../../core/models/habitudes';

@Injectable({ providedIn: 'root' })
export class HabitudesService {
  private http = inject(HttpClient);

  heatmap(annee: number) {
    return this.http
      .get<ApiOk<HeatmapResponse>>(`${API_URL}/habitudes/heatmap`, { params: { annee } })
      .pipe(map((r) => r.data));
  }
}