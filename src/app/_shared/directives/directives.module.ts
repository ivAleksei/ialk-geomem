import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputMaskDirective } from './input-mask.directive';
import { UiSortableDirective } from './ui-sortable.directive';
import { IonicGestureConfig } from './ionic-gesture-config';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { LongPressDirective } from './long-press.directive';
import { DebounceDirective } from './debounce.directive';
@NgModule({
  declarations: [
    InputMaskDirective,
    DebounceDirective,
    UiSortableDirective,
    LongPressDirective
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }
  ],
  exports: [
    DebounceDirective,
    UiSortableDirective,
    InputMaskDirective,
    LongPressDirective,
  ]
})
export class DirectivesModule { }
