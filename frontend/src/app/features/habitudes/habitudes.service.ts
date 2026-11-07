import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/config';
import { HeatmapResponse } from '../../core/models/habitudes';

@Injectable({ providedIn: 'root' })
export class HabitudesService {
  private http = inject(HttpClient);

  heatmap(annee: number) {
    return this.http.get<HeatmapResponse>(`${API_URL}/habitudes/heatmap`, {
      params: { annee },
    });
  }
}