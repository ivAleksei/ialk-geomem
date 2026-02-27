import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import * as $ from 'jquery';

@Directive({
  selector: '[debounce]'
})
export class DebounceDirective {
  @Output() public changeEvent: EventEmitter<any> = new EventEmitter();
  @Input() DEBOUNCE_TIME: any = 3 * 1000;
  elem: any;
  timer: any;


  constructor(
    private el: ElementRef
  ) {
    this.elem = this.el.nativeElement;
  }


  ngAfterViewInit() {
    $(this.elem).on('input', (e: any) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // console.log(`Executando após ${this.DEBOUNCE_TIME / 1000} segundos:`, e.target.value);
        this.changeEvent.next({
          str: e.target.value
        });
      }, this.DEBOUNCE_TIME);
    })
  }
}
