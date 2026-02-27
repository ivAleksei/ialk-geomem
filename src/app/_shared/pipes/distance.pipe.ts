import { Pipe, PipeTransform } from "@angular/core";

/**
 * Recebe um valor e retorna o valor mascarado de acordo com o formato definido. Por padrão, utiliza-se o formato 'DD/MM/YYYY'.
 */
@Pipe({
  name: "distance",
})
export class DistancePipe implements PipeTransform {

  transform(value: any, unity: string): any {
    let val;
    let regex = new RegExp(`^-?\\d+(?:\\.\\d{0,2})?`);
    let map = {
      km: (meters) => ((meters / 1000).toString().match(regex) || [null])[0],
      mi: (meters) => ((meters / 1610).toString().match(regex) || [null])[0]
    }
    if (map[unity])
      val = map[unity](value);

    return val || '0.00';
  }
}