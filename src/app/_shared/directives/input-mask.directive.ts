import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from "moment";
import * as $ from 'jquery';
import { DecimalPipe } from "../pipes/decimal.pipe";
import { CurrencyPipe } from "../pipes/currency.pipe";

@Directive({
  selector: "[data-mask]",
  providers: [
    DecimalPipe,
    CurrencyPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputMaskDirective,
      multi: true,
    },
  ],
})
export class InputMaskDirective implements ControlValueAccessor {
  constructor(
    private el: ElementRef,
    private CurrencyPipe: CurrencyPipe,
    private DecimalPipe: DecimalPipe
  ) { }

  @Input() mask: any;
  elem: any = this.el.nativeElement;
  data_mask: any;
  reverse: any;

  onTouched: any = (event) => { };
  onChange: any = (event) => { };

  ngAfterViewInit() {
    this.data_mask = $(this.elem).attr("data-mask");
    this.reverse = $(this.elem).attr("reverse");
    this.mask = this.getPattern();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;

  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any, first?: any) {
    let format;
    let reverse = this.reverse || false;
    if (!first)
      setTimeout(() => {
        let new_val = $(this.elem).val();

        if (new_val != value)
          this.writeValue(new_val, true);
      }, 200);

    if (value) {
      switch (this.data_mask) {
        case "currency":
          format = this.formatCurrency(value);
          this.el.nativeElement.value = format;
          break;
        case "decimal":
          format = this.formatDecimal(String(value));
          this.el.nativeElement.value = format;
          break;
        case "time":
          this.el.nativeElement.value = moment(value).format("HH:mm");
          break;
        case "date":
          this.el.nativeElement.value = moment(value).format("DD/MM/YYYY");
          break;
        default:
          let valor = (String(value) || "").replace(/\D/g, "");
          let pad = this.mask.replace(/\D/g, "").replace(/9/g, "_");
          let valorMask = valor + pad.substring(0, pad.length - valor.length);
          let valorMaskPos = 0;

          if (reverse) {
            valorMask = pad.substring(0, pad.length - valor.length) + valor;
            this.mask = this.mask.split('').reverse().join('');
            valorMask = valorMask.split('').reverse().join('');
          }

          valor = "";
          for (var i = 0; i < this.mask.length; i++) {
            if (isNaN(parseInt(this.mask.charAt(i)))) {
              valor += this.mask.charAt(i);
            } else {
              valor += valorMask[valorMaskPos++];
            }
          }

          if (reverse) {
            valor = valor.substring(0, valor.indexOf('_'));
            valor = valor.split('').reverse().join('');
          }

          if (valor.indexOf("_") > -1) {
            valor = valor.substr(0, valor.indexOf("_"));
          }

          this.el.nativeElement.value = valor;
      }
    } else {
      this.el.nativeElement.value = "";
    }
  }

  @HostListener("keyup", ["$event"])
  onKeyup($event: any) {
    let valor = $event.target.value.replace(/\D/g, "");
    if ($event.keyCode === 189) {
      return;
    }


    let pad = this.mask.replace(/\D/g, "").replace(/9/g, "_");

    let valorMask = valor + pad.substring(0, pad.length - valor.length);

    if (valor.length <= pad.length) {
      this.setModelValue($event, valor);
    }
    if ($event.keyCode === 8) {
      return this.deleteFunction($event, valor);
    }
    let reverse = this.reverse || false;

    if (this.data_mask == 'milhar')
      reverse = true;

    switch (this.data_mask) {
      case "currency":
        $event.target.value = this.formatCurrency(
          String(Number($event.target.value.replace(/\D/g, "")) / 100)
        );
        break;
      case "decimal":
        $event.target.value = this.formatDecimal(
          String(Number($event.target.value.replace(/\D/g, "")) / 10)
        );
        break;
      default:
        if (reverse) {
          valorMask = pad.substring(0, pad.length - valor.length) + valor;
        }

        let format = this.mask;
        let value = valorMask;

        if (value) {
          let rawValue = "";
          let regex = /\w/;
          let i = 0;
          value = value.trim();
          for (let c in format) {
            if (c < format.length && value[i])
              if (regex.test(format[c])) {
                rawValue += value[i];
                i++;
              } else {
                rawValue += format[c];
              }
          }

          if (reverse) {
            rawValue = rawValue.substring(rawValue.indexOf(valor[0]));
          }

          if (rawValue.indexOf("_") > -1) {
            rawValue = rawValue.substr(0, rawValue.indexOf("_"));
          }
          valor = rawValue;
        } else {
          valor = "-";
        }

        $event.target.value = valor;
    }
  }

  getPattern(pattern?: string): string {
    let mask = pattern || this.data_mask;

    switch (mask) {
      case "date":
        return "99/99/9999";
      case "time":
        return "99:99:99";
      case "date_time":
        return "99/99/9999 99:99:99";
      case "cep":
        return "99999-999";
      case "decimal":
        return "999.999.999,9";
      case "currency":
        return "999.999.999,99";
      case "milhar":
        return "999.999.999.999";
      case "phone":
        return "9999-9999";
      case "cellphone":
        return "99999-9999";
      case "phone_with_ddd":
        return "(99) 9999-9999";
      case "cellphone_with_ddd":
        return "(99) 99999-9999";
      case "global_phone":
        return "+99 (99) 9999-9999";
      case "cpf":
        return "999.999.999-99";
      case "cnpj":
        return "99.999.999/9999-99";
      case "bank-account":
        return "99.999-9";
      case "agency":
        return "999999-9";
      case "numProcesso":
        return "999999";
      case "numRecibo":
        return "9999999";
      case "ano":
        return "9999";
      default:
        return this.data_mask;
    }
  }

  setModelValue($event: any, valor: any) {
    let new_value;

    switch (this.data_mask) {
      case "decimal":
        new_value = +(valor.replace(/\D/g, "")) / 10;
        break;
      case "currency":
        new_value = +(valor.replace(/\D/g, "")) / 100;
        break;
      case "time":
        if (
          $event.target.value.length == 2 ||
          $event.target.value.length == 4
        ) {
          new_value = moment($event.target.value, "HH:mm").format();
        }
        break;
      case "date":
        if (
          $event.target.value.length == 2 ||
          $event.target.value.length == 5 ||
          $event.target.value.length == 10
        ) {
          new_value = moment($event.target.value, "DD/MM/YYYY").format();
        }
        break;
      default:
        new_value = valor;
    }

    this.onChange(new_value);

  }

  deleteFunction($event: any, valor: any) {
    switch (this.data_mask) {
      case "time":
        if (
          $event.target.value.length == 2 ||
          $event.target.value.length == 4
        ) {
          this.onChange(moment(valor, "HH:mm").format());
        } else if ($event.target.value.length < 2) {
          this.onChange("");
        }
        break;
      case "date":
        if (
          $event.target.value.length == 2 ||
          $event.target.value.length == 5 ||
          $event.target.value.length == 10
        ) {
          this.onChange(moment(valor, "DD/MM/YYYY").format());
        } else if ($event.target.value.length < 2) {
          this.onChange("");
        }
        break;
      case "currency":
        $event.target.value = this.formatCurrency(
          String(Number($event.target.value.replace(/\D/g, "")) / 100)
        );
        break;
      case "decimal":
        $event.target.value = this.formatDecimal(
          String(Number($event.target.value.replace(/\D/g, "")) / 10)
        );
        break;
      default:
        valor = valor.replace(/\D/g, "");
        this.onChange(valor);
    }
  }

  formatCurrency(valor: string) {
    return this.CurrencyPipe.transform(valor);
  }

  formatDecimal(valor: string) {
    return this.DecimalPipe.transform(valor);
  }
}
