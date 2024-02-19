import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AccessJson } from '../models/accessJson';
@Injectable({
  providedIn: 'root',
})
export class AccessService {
  
  constructor(private http: HttpClient) {
   
  }
  
  getAccess() {
    const headers = new HttpHeaders({
      'x-api-key': environment.xApiKey
    });
    return this.http.get<any>(environment.urlToDbExpress, { headers });
  }

  updateAccess(idOggettoDbRest: string, json: AccessJson) {
    const headers = new HttpHeaders({
      'x-api-key': environment.xApiKey
    });
    return this.http.put<any>(
      `${environment.urlToDbExpress}/${idOggettoDbRest}`,
      json,
      { headers }
    );
  }
}
