import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  media: string;
  status: string;
  created_at: string;
  updated_at: string;
  userId: number;
  username: string;
}

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.css']
})
export class MyMapComponent implements OnInit {
  map: L.Map | undefined;
  incidents: Incident[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();
    this.fetchIncidents();
  }

  private initMap(): void {
    this.map = L.map('leaflet-map').setView([33.87570700, 7.88490100], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private fetchIncidents(): void {
    this.http.get<Incident[]>('http://localhost:3001/incidents').subscribe(
      (data) => {
        this.incidents = data;
        this.addMarkers();
      },
      (error) => {
        console.error('Error fetching incidents:', error);
      }
    );
  }

  private addMarkers(): void {
    this.incidents.forEach(incident => {
      L.marker([incident.latitude, incident.longitude]).addTo(this.map!)
        .bindPopup(`<b>${incident.title}</b><br>${incident.description}<br>Reported by: ${incident.username}`)
        .openPopup();
    });
  }
}