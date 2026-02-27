import { Injectable } from '@angular/core';
import { Manager } from "socket.io-client";


import { AlertsService } from './alerts.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';
import { NotificationsService } from '../providers/notifications.service';
import { UsersService } from '../providers/users.service';

// import { UserService } from '../providers/user.service';
// import { PersonsService } from '../providers/persons.service';
// import { UsersService } from '../providers/users.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    manager: any;
    socket: any;
    platformSocket: any;
    subscriptions: any = {};

    constructor(
        private usersService: UsersService,
        private notificationsService: NotificationsService,
        private alertsService: AlertsService,
        private storage: LocalStorageService
    ) { }

    init() {
        if (!navigator.onLine) return;
        try {
            this.manager = new Manager(environment.Socket.url);
        } catch (error) {
            console.log(error);
            // this.alertsService.notify({ type: "warning", msg: "", title: "Sem Conexão" })
        }
    }

    start(endpoint?) {
        if (navigator.onLine) {
            // console.log('socket');
            try {
                this.manager = new Manager(environment.Socket.url);
                this.platformSocket = this.manager.socket(`/${environment.Socket.platform}-${endpoint}`);
                this.platformSocket.on('event', (ev) => this.handleEvent(ev));
            } catch (error) {
                // console.log(error);

                this.alertsService.notify({
                    type: "warning",
                    msg: "",
                    title: "Sem Conexão"
                })
            }
        }
    }

    close(endpoint?) {
        if (Object.keys(this.subscriptions[endpoint] || {})?.length) {
            this.subscriptions[endpoint].disconnect();
            delete this.subscriptions[endpoint];
        }
    }

    async handleEvent(ev: any) {
        let _id = await this.storage.get('_id');
        if (!environment.production)
            console.log(_id, ev);

        if (ev.data?._user && ev.data?._user != _id) return;

        try {
            let map_ev = {
                'users': () => this.usersService.trigger(),
                'notifications': () => this.notificationsService.trigger()
            }

            if (!map_ev[ev.table_obj])
                return console.log(`handle not defined to table:`, ev.table_obj);


            return map_ev[ev.table_obj]();
        } catch (error) {
            console.log(error);
        }
    }
}