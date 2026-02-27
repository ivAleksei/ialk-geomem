import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceEntryFormPageRoutingModule } from './place-entry-form-routing.module';

import { PlaceEntryFormPage } from './place-entry-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceEntryFormPageRoutingModule
  ],
  declarations: [PlaceEntryFormPage]
})
export class PlaceEntryFormPageModule {}
