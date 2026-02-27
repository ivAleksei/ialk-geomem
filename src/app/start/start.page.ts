import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../_shared/services/local-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private nav: NavController,
    private storage: LocalStorageService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let home_page;

    home_page = '/login-auth';
    await this.storage.set('home_page', home_page);

    setTimeout(() => {
      this.nav.navigateForward(home_page);
    }, 3 * 1000);
  }
}
