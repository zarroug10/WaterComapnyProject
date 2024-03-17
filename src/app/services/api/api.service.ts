import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.geoapify.com/v1';

  constructor(private http: HttpClient) { }

  getRoutingData(waypoints: string[]): Observable<any> {
    const apiKey = '0900e857be8248e283fd6a42e685de5e';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${waypoints.join('|')}&mode=drive&apiKey=${apiKey}`;
    return this.http.get(proxyUrl + apiUrl);
  }
}
