import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from '../_shared/services/local-storage.service';
import { I18nService } from '../_shared/services/i18n.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../_shared/providers/user.service';

@Component({
  selector: 'app-login-auth',
  templateUrl: './login-auth.page.html',
  styleUrls: ['./login-auth.page.scss'],
})
export class LoginAuthPage implements OnInit {
  @ViewChild("LoginForm") LoginForm: any;
  loading: any;
  production: any = environment.production;
  show_password: boolean = false;
  constructor(
    public nav: NavController,
    public userService: UserService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userService.clearData();
  }

  login() {
    return this.nav.navigateForward('/map');
    let obj = Object.assign({}, this.LoginForm.value);

    // this.nav.navigateForward('/internal');
    // if (!environment.production)
    //   obj = { username: "ivaleksei356@gmail.com", password: "1134" }

    this.userService.signIn(obj)
      .then(done => {
        if (done) this.LoginForm.form.reset();
      });
  }

  chkSubmit(ev) {
    if (ev?.keyCode == 13)
      this.login();
  }

}
