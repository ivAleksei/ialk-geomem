import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ToastrModule } from 'ngx-toastr';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpService } from './_shared/services/http.service';
import { LocationService } from './_shared/services/location.service';
import { UtilsService } from './_shared/services/utils.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { PipesModule } from './_shared/pipes/pipes.module';
import { SocketService } from './_shared/services/socket.service';
import { NgChartsModule } from 'ng2-charts';

// import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    ToastrModule.forRoot({}),
    AppRoutingModule,
    HammerModule,
    PipesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgChartsModule,
  ],
  providers: [
    // BackgroundMode,
    Geolocation,
    HTTP,
    HttpService,
    LocationService,
    Network,
    OneSignal,
    SocketService,
    UtilsService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
