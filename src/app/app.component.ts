import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './_shared/services/http.service';
import { LocalStorageService } from './_shared/services/local-storage.service';
import { NavController, Platform } from '@ionic/angular';
import moment from 'moment';

import { StatusBar, Style } from '@capacitor/status-bar';

import { register } from 'swiper/element/bundle';
import { OneSignalService } from './_shared/services/onesignal.service';
import { LocationService } from './_shared/services/location.service';
import { SocketService } from './_shared/services/socket.service';
import { LeafLetService } from './_shared/services/leaflet.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  mobile: any;

  constructor(
    private nav: NavController,
    private http: HttpService,
    private platform: Platform,
    private OneSignalService: OneSignalService,
    private locationService: LocationService,
    private socket: SocketService,
    private leafletService: LeafLetService,
    private storage: LocalStorageService,
  ) {
    moment.locale('pt-br');

    this.setupApp();
    this.checkVersionUpdate();
  }

  async setupApp() {
    this.checkSSL();

    await this.platform.ready();
    this.mobile = (this.platform.is('cordova') || this.platform.is('capacitor'));
    if (this.mobile)
      await StatusBar.setStyle({ style: Style.Dark });

    this.setVersion();
    // this.OneSignalService.start(environment);
    this.leafletService.init();
    this.locationService.start(environment);
    this.startSocket();
  }

  async checkSSL() {
    if (environment.production && window.location.protocol != 'https:') {
      window.location.href = window.location.href.replace(window.location.protocol, 'https:');
    }
  }

  async startSocket() {
    await this.socket.init();
    await this.socket.start(environment.production ? 'production' : 'development');
  }

  async setVersion() {
    let info = await this.http.get('/assets/geomem/json/build.json');
    await this.storage.set('version_info', info || { str: "1.0.0", revision: 412 });
  }

  async checkVersionUpdate() {
    if (!environment.production) return;
    let data = await this.http.pureGet('/revision');
    let last_rev = await this.storage.get('_rev');
    if (!last_rev || last_rev != data?.revision) {
      await this.storage.set('_rev', data?.revision);
      window.location.href = `${environment.portal.url}?t=${data?.revision}`;
    }
  }
}
