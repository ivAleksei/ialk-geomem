import { Directive, Output, EventEmitter, ElementRef } from "@angular/core";

@Directive({
    selector: "[longPress]",
    host: {
        "(click)": "onClick($event)",
        "(press)": "onPress($event)",
        "(pressup)": "onPressUp($event)",
    },
})
export class LongPressDirective {
    @Output() public clicked: EventEmitter<any> = new EventEmitter();
    @Output() public longPressed: EventEmitter<any> = new EventEmitter();

    elem: any;
    skip_click: boolean = false;

    constructor(
        private el: ElementRef
    ) {
        this.elem = this.el.nativeElement;

    }
    public progress: number = 0;

    private interval: any;

    onClick(ev?) {
        if (!ev.target.hasAttribute('longPress'))
            return;

        if (this.skip_click) {
            this.skip_click = false;
            return;
        }

        this.clicked.emit({ _ev: ev });
    }
    onPress(ev?) {

        this.skip_click = true;
        this.progress = 0;
        this.startInterval();
    }
    onPressUp(ev?) {
        this.stopInterval();
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.progress += 1;
        }, 100);
    }

    stopInterval() {
        let t = this.progress / 10;

        this.longPressed.emit({ pressed: true, time: String(t) });

        setTimeout(() => {
            if (this.interval)
                clearInterval(this.interval);
        }, 400);
    }
}
