import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsService } from './alerts.service';
import { LocationService } from './location.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LeafLetService {
  markers: any = [];
  dark: boolean = false;

  private _watch: BehaviorSubject<any>;
  public watch: Observable<any>;

  mobile: boolean = false;
  public initialized: boolean = false;

  public map: any;


  constructor(
    private nav: NavController,
    private locationService: LocationService,
    private alertsService: AlertsService,
    private platform: Platform,
  ) {
    this._watch = <BehaviorSubject<any>>new BehaviorSubject(false);
    this.watch = this._watch.asObservable();

    this.locationService.watch.subscribe(ev => {
      if (ev) this.init();
    })
  }

  async init() {
    if (this.initialized) return;

    await this.platform.ready();
    this.mobile = (this.platform.is('cordova') || this.platform.is('capacitor'));

    return Promise.resolve(true)
      .then(start => {
        if (this.mobile) return this.setupMobile();

        return this.setupBrowser();
      })
      .catch(err => {
        console.log(err);
        return;
      })
  }

  setupMobile() {
    console.log('setupMobile');
    console.log('Leaflet initialized');
    return this.initialized;
  }

  async setupBrowser() {
    if (L) {
      this.initialized = true;
      console.log('Leaflet initialized');
    }
    return this.initialized;

  }

  async startMap(args: any) {
    if (!args.center?.lat || !args.center?.lng) {
      this.alertsService.notify({ type: "warning", subtitle: "Houve um problema com a inicialização do mapa." })
      return;
    }
    try {
      var map = L.map(['map', args.ref].join('-'), {
        center: args.center,
        zoomControl: false,
        zoom: 16
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 13,
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      this.map = map;
      return map;
    } catch (error) {
      console.log(error);
      // this.nav.navigateBack('/internal/profile');
      return null;
    }
  }

  drawPath(path: any, map: any) {
    var polyline = L.polyline(path, { color: 'red' }).addTo(map);
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
  }

  watchUser(map: any) {
    map.locate({ setView: true, maxZoom: 16 });
    function onLocationFound(e) {
      var radius = e.accuracy;
      L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);
    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);
  }

  toggleDarkMode(center) {
    // this.dark = !this.dark;
    // let mapOptions = Object.assign(this.MAP_OPTIONS, { center: center });
    // mapOptions.styles = this.dark ? this.DARK_SETTINGS : [];
    // this.map.setOptions(mapOptions);
  }

  setMarkers(markers, map) {
    // try {
    //   this.markers.map(m => {
    //     m.setMap(null);
    //     return m;
    //   })
    //   this.markers = (markers || []).map((m, i) => {
    //     let point = new google.maps.Marker(Object.assign({}, m, { map: map }));
    //     point.setClickable(false);
    //     if (m.done) m.setMap(null);

    //     return point;
    //   });

    //   return this.markers;
    // } catch (err) {

    // }
  }
}