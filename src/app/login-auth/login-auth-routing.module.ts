import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginAuthPage } from './login-auth.page';

const routes: Routes = [
  {
    path: '',
    component: LoginAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginAuthPageRoutingModule {}
