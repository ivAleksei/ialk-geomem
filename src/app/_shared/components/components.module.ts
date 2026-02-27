import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FloatingButtonsComponent } from './floating-buttons/floating-buttons.component';
import { PipesModule } from '../pipes/pipes.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    FloatingButtonsComponent,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    PipesModule,
    LeafletModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    FloatingButtonsComponent,
    LeafletModule,
  ]
})
export class ComponentsModule { }
