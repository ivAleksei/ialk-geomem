import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsService } from './alerts.service';
import { I18nService } from './i18n.service';
// import { NotificationsService } from '../providers/notifications.service';

declare var window: any;

@Injectable({
    providedIn: 'root'
})
export class OneSignalService {

    private _watch: BehaviorSubject<any>;
    public watch: Observable<any>;

    mobile: boolean = false;
    initialized: boolean = false;
    environment: any;

    public OneSignal: any;

    lib: any = {
        loaded: false,
        src: "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
    };


    constructor(
        private nav: NavController,
        private alertsService: AlertsService,
        private platform: Platform,
        private i18n: I18nService,
        private OneSignalMobile: OneSignal,
        // private NotificationsService: NotificationsService,
    ) {
        this._watch = <BehaviorSubject<any>>new BehaviorSubject(false);
        this.watch = this._watch.asObservable();
    }

    async start(environment) {
        if (!environment.production || this.initialized) return;
        this.environment = environment;

        await this.platform.ready();
        this.mobile = (this.platform.is('cordova') || this.platform.is('capacitor'));

        return Promise.resolve(true)
            .then(start => {
                if (this.mobile) return this.setupMobile();

                return this.setupBrowser();
            })
            .then(done => {
                this.OneSignal?.Slidedown.promptPush();
            })
            .catch(err => {
                console.error(err);
                return;
            })
    }

    setupMobile() {
        // OneSignalMobile
    }

    async setupBrowser() {
        await this.platform.ready();
        let perm = await Notification.requestPermission();
        if (perm === 'granted') {

        } else {
            this.alertsService.notify({
                type: "warning",
                subtitle: this.i18n.lang.NOTIFICATIONS_NOT_ALLOWED
            })
        }

        await this.loadCdnScript();

        return new Promise(resolve => {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push((OneSignal) => {
                OneSignal.init({
                    appId: this.environment.oneSignal.appId,
                });

                OneSignal.User.PushSubscription.id;
                this.OneSignal = OneSignal;
            });
            this.initialized = true;
            this._watch.next(true);
            resolve(true);
        })
    }

    loadCdnScript() {
        return new Promise((resolve, reject) => {
            if (this.lib.loaded) {
                resolve(true);
            } else {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.lib.src;

                script.onload = () => {
                    this.lib.loaded = true;

                    resolve(true);
                };

                script.onerror = () => {
                    reject(false);
                };

                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    }

    async sendTags(tags) {
        if (!this.initialized) return;

        if (this.initialized) {
            if (this.mobile) {

            } else {
                await this.OneSignal.User.addTags(tags);
            }
        }
        return true;
    }
}