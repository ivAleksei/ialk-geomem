import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceEntryFormPage } from './place-entry-form.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceEntryFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceEntryFormPageRoutingModule {}
