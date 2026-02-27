import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

/**
 * Recebe um valor e retorna o valor mascarado de acordo com o formato definido. Por padrão, utiliza-se o formato 'DD/MM/YYYY'.
 */
@Pipe({
  name: "time",
})
export class TimePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '00:00';

    value = Math.floor(+value);
    let hour = value >= 3600 ? (Math.floor(value / 3600)) : 0;
    value -= hour * 3600;

    let min = value >= 60 ? Math.floor(value / 60) : 0;
    value -= min * 60;

    let sec = value % 60;

    return [
      (hour ? ('00' + hour).slice(-2) : null),
      ("00" + min).slice(-2),
      ('00' + sec).slice(-2)
    ].filter(t => t).join(':');
  }
}