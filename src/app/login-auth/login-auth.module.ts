import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginAuthPageRoutingModule } from './login-auth-routing.module';

import { LoginAuthPage } from './login-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginAuthPageRoutingModule
  ],
  declarations: [LoginAuthPage]
})
export class LoginAuthPageModule {}
