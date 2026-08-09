import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductReportService {

  // Change this to your API URL
  private apiUrl = 'https://localhost:7284/api/ProductReport';

  constructor(private http: HttpClient) { }

  // Download Product PDF
  downloadProductReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, {
      responseType: 'blob'
    });
  }
}
