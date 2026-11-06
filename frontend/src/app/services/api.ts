import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Api {
  private base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  health() {
    return this.http.get<any>(`${this.base}/health`);
  }
}