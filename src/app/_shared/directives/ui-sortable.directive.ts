import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[UiSortable]'
})
export class UiSortableDirective {
  @Input() origin: any;
  @Input() connect: any;
  @Output() public changeList: EventEmitter<any> = new EventEmitter();
  elem: any;


  constructor(
    private el: ElementRef
  ) {
    this.elem = this.el.nativeElement;
  }

  ngAfterViewInit() {
    $([this.origin, this.elem.id].filter(s => s).map(s => `#${s}`).join(',')).sortable({
      connectWith: this.connect || null,
      update: (ev, ui) => {
        var items = {};

        $(`#${this.elem.id} li`).each((i, el, c) => {
          items[$(el).attr('id')] = 1;
        });
        $(`#${this.elem.id} tr`).each((i, el, c) => {
          items[$(el).attr('id')] = 1;
        });

        this.changeList.next({
          id: this.elem.id,
          list: Object.keys(items || {}).filter(s => s != 'undefined')
        });
      }
    }).disableSelection();
  }
}
