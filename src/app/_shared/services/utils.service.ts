import $ from "jquery";
import moment from "moment";

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AlertsService } from "./alerts.service";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class UtilsService {
  private _watch: BehaviorSubject<any>;
  public watch: Observable<any>;

  http: any;
  mobile: any = false;

  colors: any = ["#414dcc", "#2dd36f", "#92949c", "#ff8fe6", "#ffc409", "#ff5b09", "#eb445a", '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  constructor(
    private storage: LocalStorageService,
    private alertsService: AlertsService
  ) {
    this._watch = <BehaviorSubject<any>>new BehaviorSubject(false);
    this.watch = this._watch.asObservable();
  }

  getImageSize(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = url;
    });
  }

  validFile(file) {
    let size = +(file.size / 1048576).toFixed(1);
    if (size > 3) {
      this.alertsService.notify({ type: "warning", subtitle: "O tamanho do arquivo excede 3MB" });
      return false;
    }

    return true;
  }

  async loopArrayPromise(array, promise) {
    if (!array) array = [];
    let handleIndex = (index) => {
      return Promise.resolve(array[index]).then((obj) => {
        if (!obj) return array;
        return promise(obj).then((done) => handleIndex(index + 1));
      });
    };

    return handleIndex(0).then((done) => {
      return done;
    });
  }

  public formatsDate: any = [
    moment.ISO_8601,
    "MM-DD",
    "YYYY-MM",
    "YYYY-MM-DD",
    "DD/MM/YYYY",
    "DD MMM YYYY",
    "x",
  ];

  public dateConfig: any = {
    dateInputFormat: "DD/MM/YYYY",
    placeholder: "DD/MM/YYYY",
    showWeekNumbers: false,
    isAnimated: false,
  };

  public dateRangeConfig: any = {
    rangeInputFormat: "DD/MM/YYYY",
    placeholder: "DD/MM/YYYY - DD/MM/YYYY",
    showWeekNumbers: false,
    isAnimated: false,
  };

  async handleLanguage() {
    let lang;
    let user = await this.storage.get('user');

    if (user && user.language)
      lang = user.language;

    this.dateConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dateConfig.placeholder = 'DD/MM/YYYY';
    this.dateRangeConfig.rangeInputFormat = "DD/MM/YYYY";
    this.dateRangeConfig.placeholder = "DD/MM/YYYY - DD/MM/YYYY";

    if (lang != 1) {
      this.dateConfig.dateInputFormat = 'MM/DD/YYYY';
      this.dateConfig.placeholder = 'MM/DD/YYYY';

      this.dateRangeConfig.rangeInputFormat = "MM/DD/YYYY";
      this.dateRangeConfig.placeholder = "MM/DD/YYYY - MM/DD/YYYY";
    }

    this._watch.next(true);
  }

  addressStr(obj: any) {
    return Object.keys(obj).map(k => obj[k]).join(', ');
  }

  getObjContent(prop, obj) {
    let content;
    try {
      if (prop && prop.includes(".")) {
        let split = prop.split(".");
        content = obj;
        for (const s of split) {
          content = content[s];
          if (!content) {
            content = "-";
            continue;
          }
        }
      }

      if (!content) content = obj[prop];

      if (!content) return "-";

      return content;
    } catch (error) {
      return "-";
    }
  }

  copyToClipboard(str) {
    navigator.clipboard.writeText(str);
    this.alertsService.notify({ title: "Atividade Concluída", subtitle: "GPX copiado!" })
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  mapObj(arr, prop) {
    let obj = {};
    for (let a of arr) {
      obj[a[prop]] = a;
    }
    return obj;
  }

  getBase64(file) {
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        // console.log('Error: ', error);
        resolve(null);
      };
    })
  }
}
