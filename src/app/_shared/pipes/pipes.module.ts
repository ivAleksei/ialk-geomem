import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyPipe } from './currency.pipe';
import { CustomFormatPipe } from './custom-format.pipe';
import { DatePipe } from './date.pipe';
import { DecimalPipe } from './decimal.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { ObjKeyPipe } from './obj-key.pipe';
import { StatusPipe } from './status.pipe';
import { DistancePipe } from './distance.pipe';
import { TimePipe } from './time.pipe';



@NgModule({
  declarations: [
    CurrencyPipe,
    CustomFormatPipe,
    DatePipe,
    DecimalPipe,
    DistancePipe,
    EllipsisPipe,
    ObjKeyPipe,
    StatusPipe,
    TimePipe,
  ],
  imports: [
    CommonModule
  ],
  providers: [
    CurrencyPipe,
    CustomFormatPipe,
    DatePipe,
    DecimalPipe,
    DistancePipe,
    EllipsisPipe,
    ObjKeyPipe,
    StatusPipe,
    TimePipe,
  ],
  exports: [
    CurrencyPipe,
    CustomFormatPipe,
    DatePipe,
    DecimalPipe,
    DistancePipe,
    EllipsisPipe,
    ObjKeyPipe,
    StatusPipe,
    TimePipe,
  ],
})
export class PipesModule { }
