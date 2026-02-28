import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { I18nService } from '../_shared/services/i18n.service';
import { LoadingService } from '../_shared/services/loading.service';
import { AlertsService } from '../_shared/services/alerts.service';
import { UtilsService } from '../_shared/services/utils.service';
import { HttpService } from '../_shared/services/http.service';

import { latLng, marker, tileLayer } from 'leaflet';
import { LocationService } from '../_shared/services/location.service';
import { PlaceEntriesService } from '../_shared/providers/place-entries.service';
declare var L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  entries: any = [];
  obj_markers: any = [];

  leafletMap: any;
  centerMap: any;

  user_marker: any;
  user_icon: any = L.icon({ iconUrl: '/assets/geomem/imgs/user_position.png', iconSize: [23, 23], iconAnchor: [11, 23] });
  pin_icon: any = L.icon({ iconUrl: '/assets/geomem/imgs/pin_icon.png', iconSize: [36, 42], iconAnchor: [18,42] });

  constructor(
    public nav: NavController,
    public i18n: I18nService,
    private http: HttpService,
    private utils: UtilsService,
    private locationService: LocationService,
    private placeEntriesService: PlaceEntriesService,
    private alertsService: AlertsService,
    private loadingService: LoadingService,
  ) {
    this.locationService.watch.subscribe(ev => {
      console.log(ev);

    })
  }

  ngOnInit() {
    this.setupPage();
  }

  async setupPage() {
    await this.getCenterMap();
    this.setupMap();
  }

  ionViewWillEnter() {
    this.getEntries();
  }

  async getEntries() {
    let data = await this.placeEntriesService.getPlaceEntries({}, `
      lat
      lng  
    `);
    this.entries = data || [];

    for (let it of Object.values(this.obj_markers || {})) 
      (it as any).remove();
    

    for (let it of this.entries) {
      this.obj_markers[it._id] = L.marker({ lat: it.lat, lng: it.lng }, {
        icon: this.pin_icon
      }).addTo(this.leafletMap)

      this.obj_markers[it._id].on('click', (ev) => {
        this.nav.navigateForward(['/entry-form/', it._id]);
      });
    }
  }

  async getCenterMap() {
    let location = await this.locationService.getCurrentLocation();

    if (!location?.lat || !location?.lng)
      location = { lat: -5.848258, lng: -35.208679 }

    this.centerMap = {
      lat: +location?.lat || null,
      lng: +location?.lng || null,
    }

    return;
  }

  async setupMap() {
    // MONTA CAMADAS DO MAPA
    this.leafletMap = L.map('map', { zoomControl: false }).setView(latLng(this.centerMap?.lat || null, this.centerMap?.lng || null), 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.leafletMap);

    if (!this.user_marker)
      this.user_marker = L.marker(this.centerMap, {
        icon: this.user_icon
      }).addTo(this.leafletMap);

    this.leafletMap.on('click', (ev: any) => {
      let coords = Object.assign({}, ev?.latlng);
      coords.lat = +coords.lat.toFixed(6);
      coords.lng = +coords.lng.toFixed(6);
      this.setPair('latLng', coords)
    })


    setTimeout(() => {
      this.leafletMap.invalidateSize();
    }, 400);

    return Promise.resolve(null);
  }

  setPair(src, coords) {
    this.nav.navigateForward('/entry-form', { state: { coords } })
  }
}
