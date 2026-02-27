import { Injectable } from "@angular/core";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Platform } from "@ionic/angular";
import { AlertsService } from "./alerts.service";

declare var navigator: any;

@Injectable({
  providedIn: "root",
})
export class LocationService {

  private _watch: BehaviorSubject<any>;
  public watch: Observable<any>;

  initialized: boolean = false;
  public location: any = {
    lat: null,
    lng: null,
  };

  mobile: any = false;
  lost_location: any = false;
  configs: any = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 30 * 1000,
  };

  geoSubscription: any;
  _platform: any;
  popup: any;

  constructor(
    private alertsService: AlertsService,
    private geolocation: Geolocation,
    private platform: Platform
  ) {
    this._watch = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.watch = this._watch.asObservable();
  }

  async stop() {
    if (this.mobile) {

    } else {
      if (this.geoSubscription)
        navigator.geolocation.clearWatch(this.geoSubscription);
    }
  }

  async start(environment?) {
    return this.platform.ready()
      .then(ready => {
        let platforms = this.platform.platforms();
        this._platform = 'desktop';
        if (platforms.includes('android'))
          this._platform = 'android';
        if (platforms.includes('ios'))
          this._platform = 'ios';

        this.mobile = (this.platform.is('cordova') || this.platform.is('capacitor'));
        if (this.mobile) return this.setupMobile();

        return this.setupBrowser(environment);
      }).catch(err => {
        this.alertsService.notify({ type: "error", subtitle: err?.message || err });
        this.setLocation(null, 'err start');
      })
  }

  async getCurrentLocation() {
    return this.location;
  }

  async setupBrowser(environment?) {
    if (environment.production && location.protocol == 'http:') {
      this.showError({ message: "O plugin de geolocalização apenas funciona sob o protocolo https." })
      return this.setLocation(null, 'err http');
    }

    let result = await navigator.permissions.query({ name: "geolocation" });
    if (!navigator?.geolocation || result?.state === "denied") {
      return this.setLocation(null, 'A');
    }

    navigator.geolocation.getCurrentPosition(
      (data: any) => this.setLocation(data?.coords || null, 'B'), // ON SUCCESS
      err => this.showError(err), // ON ERROR
      this.configs); // CONFIGS
  }

  async watchPosition() {
    if (!this.geoSubscription)
      if (this.mobile) {
        this.geoSubscription = this.geolocation.watchPosition(this.configs).subscribe((data: any) => {
          if (!data?.coords) return this.setLocation(null, 'C');

          return this.setLocation(data?.coords || null, 'mobile.geoSubscription');
        });
      } else {
        this.geoSubscription = navigator.geolocation.watchPosition((data: any) => this.setLocation(data?.coords || null, 'C'), err => this.showError(err), this.configs);
      }
  }

  async setupMobile() {
    let data: any = await this.geolocation.getCurrentPosition(this.configs);
    if (!data?.coords) return this.setLocation(null, 'A');

    this.setLocation(data?.coords || null, 'setupMobile');

  }

  setLocation(coords, local?) {
    if (coords?.latitude == this.location?.lat && coords?.longitude == this.location?.lng) return;

    // console.log(local, coords);

    this.location = {
      lat: coords?.latitude || null,
      lng: coords?.longitude || null,
      altitude: coords?.altitude || null
    };


    if (coords?.latitude) {
      this.lost_location = false;
    } else {
      if (!this.lost_location) {
        this.lost_location = true;
      }
    }
    this._watch.next(true);
    return this.location;
  }

  showError(error) {
    if (!error?.code)
      return this.alertsService.notify({ type: "warning", subtitle: error?.message });


    switch (error?.code) {
      case error.PERMISSION_DENIED:
        // this.alertsService.notify({ type: "warning", subtitle: "O acesso à Geolocalização foi negado pelo usuário." });

        this.popup = this.createBottomSheet();
        let content = `<h3 style="margin:6px 0 8px">Habilitar localização no Chrome</h3>
          <ol>
            <li>Clique no ícone ao lado da URL</li>
            <li>Localização → Permitir</li>
            <li>Recarregue a página</li>
          </ol>`;

        if (this._platform === 'android')
          content = `<h3 style="margin:6px 0 8px">Habilitar localização no Android</h3>
          <ol>
            <li>Toque no ícone ao lado da URL</li>
            <li>Permissões → Localização → Permitir</li>
            <li>Recarregue a página</li>
          </ol>`;

        if (this._platform === 'ios')
          content = ` <h3 style="margin:6px 0 8px">Habilitar localização no iOS</h3>
          <ol>
            <li>Ajustes → Privacidade e Segurança</li>
            <li>Serviços de Localização</li>
            <li>Sites do Safari → Durante o uso do App</li>
            <li>Recarregue a página</li>
          </ol>`;


        this.popup.setContent(content);
        this.popup.show();
        break;
      case error.POSITION_UNAVAILABLE:
        this.alertsService.notify({ type: "warning", subtitle: "A informação de Geolocalização não está disponível." });
        break;
      case error.TIMEOUT:
        this.alertsService.notify({ type: "warning", subtitle: "O tempo de resposta de requisição da Geolocalização expirou." });
        break;
      case error.UNKNOWN_ERROR:
        this.alertsService.notify({ type: "warning", subtitle: "Houve erro desconhecido, tente novamente em alguns instantes." });
        break;
      default:
    }
  }

  /**
 * Cria um "bottom sheet" (div fora da tela, abaixo) e desliza para dentro.
 * Uso:
 *   const sheet = createBottomSheet();
 *   sheet.setContent("<h3>Android</h3><ol>...</ol>");
 *   sheet.show();
 *   // sheet.close();
 */
  createBottomSheet(options: any = {}) {
    const cfg = {
      id: options.id || "ux-location-sheet",
      maxWidth: options.maxWidth || 560,
      closeOnOverlay: options.closeOnOverlay !== false, // default true
      closeOnEsc: options.closeOnEsc !== false,         // default true
      ...options
    };

    // evita duplicar
    const existing = document.getElementById(cfg.id);
    if (existing) {
      return {
        el: existing,
        overlay: document.getElementById(`${cfg.id}-overlay`),
        show: () => open(existing, document.getElementById(`${cfg.id}-overlay`)),
        close: () => close(existing, document.getElementById(`${cfg.id}-overlay`)),
        setContent: (html) => setContent(existing, html),
        destroy: () => destroy(existing, document.getElementById(`${cfg.id}-overlay`))
      };
    }

    // 1) overlay
    const overlay = document.createElement("div");
    overlay.id = `${cfg.id}-overlay`;
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:rgba(0,0,0,.45)",
      "opacity:0",
      "pointer-events:none",
      "transition:opacity 180ms ease",
      "z-index:9998"
    ].join(";");

    // 2) sheet (fora da tela, abaixo)
    const sheet = document.createElement("div");
    sheet.id = cfg.id;
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.style.cssText = [
      "position:fixed",
      "left:50%",
      "bottom:0",
      "transform:translate(-50%, 110%)", // começa fora da tela (abaixo)
      "width:min(100%, " + cfg.maxWidth + "px)",
      "max-height:80vh",
      "overflow:auto",
      "background:#fff",
      "border-radius:16px 16px 0 0",
      "box-shadow:0 -12px 30px rgba(0,0,0,.25)",
      "transition:transform 240ms cubic-bezier(.2,.8,.2,1)",
      "z-index:9999",
      "padding:14px 14px 18px",
      "box-sizing:border-box",
      "will-change:transform"
    ].join(";");

    // "handle" e botão fechar
    const header = document.createElement("div");
    header.style.cssText = [
      "display:flex",
      "align-items:center",
      "justify-content:space-between",
      "gap:10px",
      "margin-bottom:8px"
    ].join(";");

    const handle = document.createElement("div");
    handle.style.cssText = [
      "width:42px",
      "height:5px",
      "border-radius:999px",
      "background:rgba(0,0,0,.18)",
      "margin:0 auto"
    ].join(";");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = [
      "border:0",
      "background:transparent",
      "font-size:18px",
      "line-height:1",
      "padding:8px 10px",
      "cursor:pointer"
    ].join(";");

    // área de conteúdo que você vai preencher depois
    const content = document.createElement("div");
    content.id = `${cfg.id}-content`;
    content.style.cssText = [
      "font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      "font-size:14px",
      "line-height:1.35",
      "color:#111"
    ].join(";");

    // header layout: handle central + botão fechar à direita
    const headerRow = document.createElement("div");
    headerRow.style.cssText = "display:grid; grid-template-columns:1fr auto 1fr; align-items:center;width: 100%;";
    const leftSpacer = document.createElement("div");
    const handleWrap = document.createElement("div");
    handleWrap.appendChild(handle);
    const rightWrap = document.createElement("div");
    rightWrap.style.cssText = "display:flex; justify-content:flex-end;";
    rightWrap.appendChild(closeBtn);

    headerRow.appendChild(leftSpacer);
    headerRow.appendChild(handleWrap);
    headerRow.appendChild(rightWrap);

    header.appendChild(headerRow);
    sheet.appendChild(header);
    sheet.appendChild(content);

    // 3) incorpora ao body
    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    // 4) eventos de fechar
    function onKeyDown(e) {
      if (cfg.closeOnEsc && e.key === "Escape") close(sheet, overlay);
    }

    if (cfg.closeOnOverlay) {
      overlay.addEventListener("click", () => close(sheet, overlay));
    }
    closeBtn.addEventListener("click", () => close(sheet, overlay));
    document.addEventListener("keydown", onKeyDown);

    // trava scroll do body quando aberto (UX)
    let prevOverflow = "";
    function lockScroll() {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    function unlockScroll() {
      document.body.style.overflow = prevOverflow || "";
    }

    function open(sheetEl, overlayEl) {
      // habilita clique no overlay antes de animar
      overlayEl.style.pointerEvents = "auto";
      overlayEl.style.opacity = "1";

      // força reflow pra garantir transição
      sheetEl.getBoundingClientRect();

      sheetEl.style.transform = "translate(-50%, 0%)"; // entra na tela
      lockScroll();
    }

    function close(sheetEl, overlayEl) {
      sheetEl.style.transform = "translate(-50%, 110%)"; // sai pra baixo
      overlayEl.style.opacity = "0";
      overlayEl.style.pointerEvents = "none";

      // libera scroll depois da animação
      window.setTimeout(unlockScroll, 260);
    }

    function setContent(sheetEl, html) {
      const c = sheetEl.querySelector(`#${cfg.id}-content`);
      if (c) c.innerHTML = html;
    }

    function destroy(sheetEl, overlayEl) {
      document.removeEventListener("keydown", onKeyDown);
      overlayEl?.remove();
      sheetEl?.remove();
      unlockScroll();
    }

    return {
      el: sheet,
      overlay,
      show: () => open(sheet, overlay),
      close: () => close(sheet, overlay),
      setContent: (html) => setContent(sheet, html),
      destroy: () => destroy(sheet, overlay)
    };
  }

}
